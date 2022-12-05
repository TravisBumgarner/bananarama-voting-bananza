import { useContext, useMemo } from 'react'
import styled from 'styled-components'

import { Heading, Paragraph } from 'sharedComponents'
import { context } from 'context'
import { colors } from 'theme'
import { TEntry } from 'types'

const EntriesWrapper = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
`

const EntryWrapper = styled.li`
    border: 4px solid ${colors.apple.base};
    border-radius: 1rem;
    margin: 1rem 0;
    padding: 0;
`
type EntryProps = {
    entry: TEntry
    votes: number
}
const Entry = ({ entry, votes }: EntryProps) => {
    const { state } = useContext(context)

    return (
        <EntryWrapper>
            <Heading.H3> {entry.entry}</Heading.H3>
            <Paragraph>{state.users[entry.userId]}</Paragraph>
            <Paragraph>Votes: {'🍌'.repeat(votes)}</Paragraph>
        </EntryWrapper>
    )
}

const Conclusion = () => {
    const { state, dispatch } = useContext(context)

    const votesByEntryId = useMemo(() => {
        return state.votes.reduce(
            (accum, { entryId }) => {
                if (!(entryId in accum)) accum[entryId] = 1 //eslint-disable-line
                else accum[entryId] += 1 //eslint-disable-line
                return accum
            },
            {} as Record<string, number>
        )
    }, [])

    return (
        <div>
            <Heading.H2>Conclusion</Heading.H2>
            <Paragraph>Votes: {JSON.stringify(votesByEntryId)}</Paragraph>
            <EntriesWrapper>
                {state.entries.map((entry) => (
                    <Entry
                        entry={entry}
                        key={entry.id}
                        votes={votesByEntryId[entry.id]}
                    />
                ))}
            </EntriesWrapper>
        </div>
    )
}

export default Conclusion
