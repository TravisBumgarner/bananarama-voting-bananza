import { gql, useSubscription } from '@apollo/client'
import { useContext, useState } from 'react'

import { Button, Icon, Modal } from 'sharedComponents'
import { context } from 'context'
import { colors } from 'theme'
import { TAddEntry } from 'types'
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

const Signup = () => {
    const [showAddEntryModal, setShowAddEntryModal] = useState(false)
    const { state, dispatch } = useContext(context)

    useSubscription<{ addEntry: TAddEntry }>(ADD_ENTRY_SUBSCRIPTION, {
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

            const { userId, roomId, entry } = data.data.addEntry
            if (roomId === state.room.id) {
                dispatch({
                    type: 'ADD_ENTRY',
                    data: {
                        userId, roomId, entry
                    }
                })
            }
        },
    })

    return (
        <div>
            <Button variation="pear" onClick={() => setShowAddEntryModal(true)}>Add Entry <Icon color={colors.pear.base} name="add" /></Button>
            <h1>Entries</h1>
            <ul>
                {state.entries.map(({ entry, userId }) => <li key={userId}>{entry}</li>)}
            </ul>
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
