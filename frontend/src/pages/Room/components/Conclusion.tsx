import { useContext, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { Heading, RoomWrapper } from 'sharedComponents'
import { context } from 'context'
import { colors } from 'theme'
import { TDemo } from 'types'

const DemosWrapper = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box
`

const DemoWrapper = styled.li`
    border: 2px solid ${colors.rotten.base};
    border-radius: 0.7em;
    padding: 0;
    margin: 0 0 1rem 0;
`
type DemoProps = {
    demo: TDemo
    votes: number
}
const Demo = ({ demo, votes }: DemoProps) => {
    return (
        <DemoWrapper>
            <Heading.H3> &quot;{demo.demo}&quot; - {demo.presenter} {'🍌'.repeat(votes)}</Heading.H3>
        </DemoWrapper>
    )
}

const Conclusion = () => {
    const { state, dispatch } = useContext(context)

    const talliedVotes = useMemo(() => {
        const data = state.room!.demos.reduce((accum, { id }) => {
            accum[id] = 0
            return accum!
        }, {} as Record<string, number>)

        state.room!.votes.forEach(({ demoId }) => data[demoId] += 1) //eslint-disable-line

        return data
    }, [])

    useEffect(() => {
        const votesForWinner = Math.max(...Object.values(talliedVotes))
        const winners: TDemo['id'][] = []

        Object.entries(talliedVotes).forEach(([id, votes]) => {
            if (votes === votesForWinner) winners.push(id)
        })
        dispatch({ type: 'ADD_WINNERS', data: winners })
    }, [])

    const Results = [...state.room!.demos]
        .sort((a, b) => talliedVotes[b.id] - talliedVotes[a.id])
        .map((demo) => (
            <Demo
                demo={demo}
                key={demo.id}
                votes={talliedVotes[demo.id]}
            />
        ))

    return (
        <RoomWrapper>
            <Heading.H2>Conclusion</Heading.H2>
            <DemosWrapper>
                {Results}
            </DemosWrapper>
        </RoomWrapper>
    )
}

export default Conclusion
