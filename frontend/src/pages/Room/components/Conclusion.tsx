import { useContext, useMemo } from 'react'
import styled from 'styled-components'

import { Heading, PageHeadingWrapper, Paragraph } from 'sharedComponents'
import { context } from 'context'
import { colors } from 'theme'
import { TEntry } from 'types'

const EntriesWrapper = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
`

const EntryWrapper = styled.li`
    border: 4px solid ${colors.blueberry.base};
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
            <Heading.H3> &quot;{entry.entry}&quot; - {state.users[entry.userId]} {'🍌'.repeat(votes)}</Heading.H3>
        </EntryWrapper>
    )
}

const Conclusion = () => {
    const { state } = useContext(context)
    console.log(state.entries)
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
            <PageHeadingWrapper>
                <Heading.H2>Conclusion</Heading.H2>
            </PageHeadingWrapper>
            <EntriesWrapper>
                {state
                    .entries
                    .sort((a, b) => votesByEntryId[a.id] - votesByEntryId[b.id])
                    .map((entry) => (
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
