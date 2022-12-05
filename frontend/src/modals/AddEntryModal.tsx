import { ApolloError, gql, useMutation } from '@apollo/client'
import { FormEvent, useCallback, useContext, useState } from 'react'

import { Button, Input } from 'sharedComponents'
import { context } from 'context'
import styled from 'styled-components'

type AddEntryProps = {
    closeModal: () => void
}

const ADD_ENTRY_MUTATION = gql`
    mutation AddEntry($roomId: String!, $userId: String!, $entry: String!) {
        addEntry(roomId: $roomId, userId: $userId, entry: $entry) {
            id
        }
    }    
`

const ButtonWrapper = styled.div`
    justify-content: space-between;
    display: flex;
    > button {
        width: 49%;
    }
`

const AddEntry = ({ closeModal }: AddEntryProps) => {
    const [entry, setEntry] = useState<string>('')
    const { state, dispatch } = useContext(context)

    const onAddEntrySuccess = useCallback(() => {
        closeModal()
    }, [])
    const onAddEntryFailure = useCallback((error: ApolloError) => {
        dispatch({ type: 'ADD_MESSAGE', data: { message: error.message, timeToLiveMS: 5000 } })
    }, [])
    const [addEntryMutation] = useMutation<any>(ADD_ENTRY_MUTATION, {
        onCompleted: onAddEntrySuccess,
        onError: onAddEntryFailure
    })

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        addEntryMutation({
            variables: {
                entry,
                userId: state.user.id,
                roomId: state.room!.id
            }
        })
        closeModal()
    }

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <Input
                        label="What would you like to demo?"
                        name="entry"
                        value={entry}
                        handleChange={(data) => setEntry(data)}
                    />
                    <ButtonWrapper>
                        <Button
                            key="cancel"
                            type="button"
                            variation="banana"
                            onClick={() => closeModal()}
                        >Cancel
                        </Button>
                        <Button
                            disabled={entry.length === 0}
                            key="submit"
                            type="submit"
                            variation="pear"
                        >Submit Entry!
                        </Button>
                    </ButtonWrapper>
                </form>
            </div>
        </div>
    )
}

export default AddEntry
