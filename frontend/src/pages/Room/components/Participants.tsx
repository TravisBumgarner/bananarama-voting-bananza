import { useContext, useMemo } from 'react'
import styled from 'styled-components'

import { Heading } from 'sharedComponents'
import { context } from 'context'
import { colors } from 'theme'

const ListItem = styled.li`
    list-style: none;
    color: ${colors.banana.base};
    margin: 0;
    padding: 0
`

const List = styled.ul`
    margin: 0;
    padding: 0;
    text-align: center;
`

const ParticipantsWrapper = styled.div`
    border-radius: 1rem;
    border: 4px solid ${colors.blueberry.base};
    padding: 1rem;
    box-sizing: border-box;
`

const DefaultParticipants = () => {
    const { state } = useContext(context)
    return (
        <List>
            {Object
                .keys(state.users)
                .sort((a, b) => {
                    return state.users[b].toLowerCase() < state.users[a].toLowerCase()
                        ? 1
                        : -1
                })
                .map((id) => {
                    return (

                        <ListItem key={id}>
                            {state.users[id]}
                        </ListItem>
                    )
                })}
        </List>
    )
}

const VotingParticipants = () => {
    const { state } = useContext(context)

    const votesCastByUser = useMemo(() => {
        const votesCounter: Record<string, number> = {}
        Object.keys(state.users).forEach((key) => { votesCounter[key] = 0 })

        state.room!.votes.forEach(({ userId }) => { votesCounter[userId] += 1 })

        return votesCounter
    }, [state.room!.votes, state.users])

    return (
        <List>
            {Object
                .keys(state.users)
                .sort((a, b) => {
                    return state.users[b].toLowerCase() < state.users[a].toLowerCase()
                        ? 1
                        : -1
                })
                .map((id) => {
                    const votesRemaining = state.room!.maxVotes - votesCastByUser[id]
                    const icon = votesRemaining > 0 ? '🍌'.repeat(votesRemaining) : '✅'
                    return (
                        <ListItem key={id}>
                            {state.users[id]} {icon}
                        </ListItem>
                    )
                })}
        </List>
    )
}

const Participants = () => {
    const { state } = useContext(context)

    let Body: JSX.Element
    switch (state.room!.status) {
        case 'signup':
        case 'conclusion': {
            Body = <DefaultParticipants />
            break
        }
        case 'voting': {
            Body = <VotingParticipants />
            break
        }
    }

    const participants = useMemo(() => {
        return Object.keys(state.users).length
    }, [state.users])

    return (
        <ParticipantsWrapper>
            <Heading.H2>{participants} Participant{participants !== 1 && 's'}</Heading.H2>
            {Body}
        </ParticipantsWrapper>
    )
}

export default Participants
