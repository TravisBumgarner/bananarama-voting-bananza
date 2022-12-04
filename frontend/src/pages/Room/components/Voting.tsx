import { gql, useSubscription } from '@apollo/client'
import { useContext, useState } from 'react'
import styled from 'styled-components'

import { Button, Heading, Icon, Modal, Paragraph } from 'sharedComponents'
import { context } from 'context'
import { colors } from 'theme'
import { TEntry } from 'types'
import { logger } from 'utilities'
import { AddEntryModal } from '../../../modals'

// const ADD_ENTRY_SUBSCRIPTION = gql`
//   subscription AddEntry {
//     addEntry {
//         roomId
//         userId
//         entry,
//         id
//     }
//   }
// `

const EntriesWrapper = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
`

const EntryWrapper = styled.li`
    border: 4px solid ${colors.apple.base};
    border-radius: 1rem;
    margin: 0;
    padding: 0;
`

const Entry = ({ entry }: { entry: TEntry }) => {
    const { state } = useContext(context)
    return (
        <EntryWrapper>
            <Heading.H3> {entry.entry}</Heading.H3>
            <Paragraph>{state.users[entry.userId]}</Paragraph>
            <Button variation="pear" onClick={() => console.log('voted')}>Vote 🍌</Button>
        </EntryWrapper>
    )
}

const Voting = () => {
    const { state, dispatch } = useContext(context)

    // useSubscription<{ addEntry: TEntry }>(ADD_ENTRY_SUBSCRIPTION, {
    //     onError: (error) => {
    //         logger(error)
    //         dispatch({
    //             type: 'ADD_MESSAGE',
    //             data: {
    //                 message: 'Failed to add entry.'
    //             }
    //         })
    //     },
    //     onData: ({ data }) => {
    //         if (!state.room || !data.data) return // This shouldn't fire before the room's details have been populated

    //         const { userId, roomId, entry, id } = data.data.addEntry
    //         if (roomId === state.room.id) {
    //             dispatch({
    //                 type: 'ADD_ENTRIES',
    //                 data: [{
    //                     userId, roomId, entry, id
    //                 }]
    //             })
    //         }
    //     },
    // })

    return (
        <div>
            <Heading.H2>Voting</Heading.H2>
            <Paragraph>You can vote {state.room?.maxVotes} more times.</Paragraph>
            <EntriesWrapper>
                {state.entries.map((entry) => <Entry entry={entry} key={entry.id} />)}
            </EntriesWrapper>
        </div>
    )
}

export default Voting
