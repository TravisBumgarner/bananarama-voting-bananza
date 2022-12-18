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

const VotingParticipants = () => {
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
        return state.room!.members.length
    }, [state.room!.members])

    return (
        <ParticipantsWrapper>
            <Heading.H2>{participants} Participant{participants !== 1 && 's'}</Heading.H2>
            {Body}
        </ParticipantsWrapper>
    )
}

export default Participants
