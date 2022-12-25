import { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'

import { Button, Heading } from 'sharedComponents'
import { context } from 'context'
import { colors, snippets } from 'theme'

const ListItem = styled.li`
    list-style: none;
    color: ${colors.rotten.base};
    margin: 0;
    padding: 0
`

const List = styled.ul`
    margin: 0;
    padding: 0;
    text-align: center;
`

const RoomMembersWrapper = styled.div`
    ${snippets.section}    
    padding: 1rem;
    box-sizing: border-box;
`

const DefaultMembers = () => {
    const { state } = useContext(context)
    return (
        <List>
            {state.room!.members
                .sort((a, b) => {
                    return b.name.toLowerCase() < a.name.toLowerCase()
                        ? 1
                        : -1
                })
                .map(({ id, name }) => {
                    return (

                        <ListItem key={id}>
                            {name}
                        </ListItem>
                    )
                })}
        </List>
    )
}

const VotingMembers = () => {
    const { state } = useContext(context)

    const votesCastByUser = useMemo(() => {
        const votesCounter: Record<string, number> = {}
        state.room!.members.forEach(({ id }) => { votesCounter[id] = 0 })

        state.room!.votes.forEach(({ userId }) => { votesCounter[userId] += 1 })

        return votesCounter
    }, [state.room!.votes, state.room!.members])

    return (
        <List>
            {state.room!.members
                .sort((a, b) => {
                    return b.name.toLowerCase() < a.name.toLowerCase()
                        ? 1
                        : -1
                })
                .map(({ id, name }) => {
                    const votesRemaining = state.room!.maxVotes - votesCastByUser[id]
                    const icon = votesRemaining > 0 ? '🍌'.repeat(votesRemaining) : '✅'
                    return (
                        <ListItem key={id}>
                            {name} {icon}
                        </ListItem>
                    )
                })}
        </List>
    )
}

const RoomMembers = () => {
    const { state, dispatch } = useContext(context)

    let Body: JSX.Element
    switch (state.room!.status) {
        case 'signup':
        case 'conclusion': {
            Body = <DefaultMembers />
            break
        }
        case 'voting': {
            Body = <VotingMembers />
            break
        }
    }

    const roomMembers = useMemo(() => {
        return state.room!.members.length
    }, [state.room!.members])

    const copyRoomToClipboard = useCallback(() => {
        dispatch({ type: 'ADD_MESSAGE', data: { message: 'Room URL copied to clipboard.' } })
        navigator.clipboard.writeText(window.location.href)
    }, [window.location.href])

    return (
        <RoomMembersWrapper>
            <Heading.H2>{roomMembers} Member{roomMembers !== 1 && 's'}</Heading.H2>
            {Body}
            <Button
                fullWidth
                type="button"
                label="Share Room"
                icon="content_copy"
                variation="banana"
                onClick={copyRoomToClipboard}
            />
        </RoomMembersWrapper>
    )
}

export default RoomMembers
