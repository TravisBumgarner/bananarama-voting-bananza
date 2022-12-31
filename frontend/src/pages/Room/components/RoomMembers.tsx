import { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'

import { Button, Heading, Paragraph } from 'sharedComponents'
import { context } from 'context'
import { colors, snippets } from 'theme'
import { TRoom } from 'types'

const ListItem = styled.li`
    list-style: none;
    color: ${colors.rotten.base};
    margin: 0;
    padding: 0;
    font-weight: 900;
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

const DefaultMembers = ({ members }: { members: TRoom['members'] }) => {
    return (
        <List>
            {Object.values(members)
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

const VotingBananaWrapper = styled.span<{ wasUsed: boolean }>`
  filter: grayscale(${({ wasUsed }) => (wasUsed ? 1 : 0)});
`
const VotingMembers = ({ members, votes, maxVotes }: TRoom) => {
    const votesCastByUser = useMemo(() => {
        const votesCounter: Record<string, number> = {}
        Object.values(members).forEach(({ id }) => { votesCounter[id] = 0 })

        votes.forEach(({ userId }) => { votesCounter[userId] += 1 })

        return votesCounter
    }, [votes, members])

    return (
        <List>
            {Object.values(members)
                .sort((a, b) => {
                    return b.name.toLowerCase() < a.name.toLowerCase()
                        ? 1
                        : -1
                })
                .map(({ id, name }) => {
                    const votesRemaining = maxVotes - votesCastByUser[id]

                    return (
                        <ListItem key={id}>
                            {name} <VotingBananaWrapper wasUsed>{'🍌'.repeat(votesCastByUser[id])}</VotingBananaWrapper>
                            <VotingBananaWrapper wasUsed={false}>{'🍌'.repeat(votesRemaining)}</VotingBananaWrapper>
                        </ListItem>
                    )
                })}
        </List>
    )
}

const RoomMembers = () => {
    const { state: { room }, dispatch } = useContext(context)

    const Body = useMemo(() => {
        if (!room) {
            return null
        }

        switch (room.status) {
            case 'signup':
            case 'conclusion': {
                return <DefaultMembers members={room.members} />
            }
            case 'voting': {
                return <VotingMembers {...room} />
            }
        }
    }, [!!room])

    const memberCount = useMemo(() => {
        if (!room) return 0
        return Object.values(room.members).length
    }, [!!room])

    const copyRoomToClipboard = useCallback(() => {
        dispatch({ type: 'ADD_MESSAGE', data: { message: 'Room URL copied to clipboard.' } })
        navigator.clipboard.writeText(window.location.href)
    }, [window.location.href])

    return (
        <RoomMembersWrapper>
            <Heading.H2>{memberCount} Member{memberCount !== 1 && 's'}</Heading.H2>
            {Body}
            <Button
                fullWidth
                type="button"
                label="Share Room"
                icon="content_copy"
                variation="banana"
                onClick={copyRoomToClipboard}
            />
            <Paragraph align="center">(Room Code: {window.location.pathname.replace('/', '')})</Paragraph>
        </RoomMembersWrapper>
    )
}

export default RoomMembers
