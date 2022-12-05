import { gql, useSubscription } from '@apollo/client'
import { useContext, useState } from 'react'
import styled from 'styled-components'

import { Button, Heading, Icon, Modal, Paragraph } from 'sharedComponents'
import { context } from 'context'
import { colors } from 'theme'
import { TEntry } from 'types'
import { logger } from 'utilities'
import { AddEntryModal } from '../../../modals'

const ADD_ENTRY_SUBSCRIPTION = gql`
  subscription AddEntry {
    addEntry {
        roomId
        userId
        entry,
        id
    }
  }
`

const EntriesWrapper = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    max-height:60vh;
    overflow-y: scroll;
`

const EntryWrapper = styled.li`
    border: 4px solid ${colors.apple.base};
    border-radius: 1rem;
    margin: 1rem 0;
    padding: 1rem;
`

const Entry = ({ entry }: { entry: TEntry }) => {
    const { state } = useContext(context)
    return (
        <EntryWrapper>
            <Heading.H3> {entry.entry}</Heading.H3>
            <Paragraph>{state.users[entry.userId]}</Paragraph>
        </EntryWrapper>
    )
}

const Signup = () => {
    const [showAddEntryModal, setShowAddEntryModal] = useState(false)
    const { state, dispatch } = useContext(context)

    useSubscription<{ addEntry: TEntry }>(ADD_ENTRY_SUBSCRIPTION, {
        onError: (error) => {
            logger(error)
            dispatch({
                type: 'ADD_MESSAGE',
                data: {
                    message: 'Failed to add entry.'
                }
            })
        },
        onData: ({ data }) => {
            if (!state.room || !data.data) return // This shouldn't fire before the room's details have been populated

            const { userId, roomId, entry, id } = data.data.addEntry
            if (roomId === state.room.id) {
                dispatch({
                    type: 'ADD_ENTRIES',
                    data: [{
                        userId, roomId, entry, id
                    }]
                })
            }
        },
    })

    return (
        <div>
            <Heading.H2>Entries</Heading.H2>
            <Button fullWidth variation="pear" onClick={() => setShowAddEntryModal(true)}>Add Entry <Icon color={colors.pear.base} name="add" /></Button>
            <EntriesWrapper>
                {state.entries.map((entry) => <Entry entry={entry} key={entry.id} />)}
            </EntriesWrapper>
            <Modal
                showModal={showAddEntryModal}
                closeModal={() => setShowAddEntryModal(false)}
                contentLabel="Add Entry!"
            >
                <AddEntryModal closeModal={() => setShowAddEntryModal(false)} />
            </Modal>
        </div>
    )
}

export default Signup
