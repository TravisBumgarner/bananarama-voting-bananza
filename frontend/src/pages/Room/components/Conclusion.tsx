import { useContext, useMemo } from 'react'
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
    border: 4px solid ${colors.blueberry.base};
    border-radius: 1rem;
    padding: 0;
    margin: 0 0 1rem 0;
`
type DemoProps = {
    demo: TDemo
    votes: number
}
const Demo = ({ demo, votes }: DemoProps) => {
    const { state } = useContext(context)

    return (
        <DemoWrapper>
            <Heading.H3> &quot;{demo.demo}&quot; - {state.users[demo.userId]} {'🍌'.repeat(votes)}</Heading.H3>
        </DemoWrapper>
    )
}

const Conclusion = () => {
    const { state } = useContext(context)
    const votesByDemoID = useMemo(() => {
        return state.votes.reduce(
            (accum, { demoId }) => {
                if (!(demoId in accum)) accum[demoId] = 1 //eslint-disable-line
                else accum[demoId] += 1 //eslint-disable-line
                return accum
            },
            {} as Record<string, number>
        )
    }, [])

    const Results = [...state.demos]
        .sort((a, b) => votesByDemoID[b.id] - votesByDemoID[a.id])
        .map((demo) => (
            <Demo
                demo={demo}
                key={demo.id}
                votes={votesByDemoID[demo.id]}
            />
        ))

    return (
        <div>
            <RoomWrapper>
                <Heading.H2>Conclusion</Heading.H2>

                <DemosWrapper>
                    {Results}
                </DemosWrapper>
            </RoomWrapper>
        </div>
    )
}

export default Conclusion
