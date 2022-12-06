import { useContext, useMemo } from 'react'

import { context } from 'context'
import { Heading, Paragraph } from 'sharedComponents'
import styled from 'styled-components'
import { colors } from 'theme'

const Wrapper = styled.div`
    border-radius: 1rem;
    border: 4px solid ${colors.banana.base};
    padding: 1rem;
    margin: 1rem 0;
`

const VotingDetails = () => {
    const { state } = useContext(context)

    const votesCast = useMemo(() => {
        return state.votes.filter(({ userId }) => userId === state.user!.id).length
    }, [state.votes])

    return (
        <Wrapper>
            <Heading.H2>Voting Details</Heading.H2>
            <Paragraph>Your Remaining Votes: {'🍌'.repeat(state.room!.maxVotes - votesCast)}</Paragraph>
            <Paragraph>Everyones Remaining Votes: {'🍌'.repeat(state.room!.maxVotes * state.room!.members.length - state.votes.length)}</Paragraph>

        </Wrapper>
    )
}

export default VotingDetails
