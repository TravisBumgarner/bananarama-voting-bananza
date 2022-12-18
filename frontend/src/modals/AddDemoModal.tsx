import { ApolloError, gql, useMutation } from '@apollo/client'
import { FormEvent, useCallback, useContext, useState } from 'react'

import { Button, Input } from 'sharedComponents'
import { context } from 'context'
import styled from 'styled-components'

type AddDemoProps = {
    closeModal: () => void
}

const ADD_DEMO_MUTATION = gql`
    mutation AddDemo($roomId: String!, $presenter: String!, $demo: String!) {
        addDemo(roomId: $roomId, presenter: $presenter, demo: $demo) {
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

const AddDemo = ({ closeModal }: AddDemoProps) => {
    const { state, dispatch } = useContext(context)
    const [demo, setDemo] = useState<string>('')
    const [presenter, setPresenter] = useState<string>(state.user!.name)

    const onAddDemoSuccess = useCallback(() => {
        closeModal()
    }, [])
    const onAddDemoFailure = useCallback((error: ApolloError) => {
        dispatch({ type: 'ADD_MESSAGE', data: { message: error.message, timeToLiveMS: 5000 } })
    }, [])
    const [addDemoMutation] = useMutation<any>(ADD_DEMO_MUTATION, {
        onCompleted: onAddDemoSuccess,
        onError: onAddDemoFailure
    })

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        addDemoMutation({
            variables: {
                demo,
                presenter,
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
                        name="demo"
                        value={demo}
                        handleChange={(data) => setDemo(data)}
                    />
                    <Input
                        label="Who is presenting?"
                        name="presenter"
                        value={presenter}
                        handleChange={(data) => setPresenter(data)}
                    />
                    <ButtonWrapper>
                        <Button
                            type="button"
                            key="cancel"
                            variation="banana"
                            label="Cancel"
                            icon="cancel"
                            onClick={() => closeModal()}
                        />
                        <Button
                            disabled={demo.length === 0}
                            key="submit"
                            type="submit"
                            variation="pear"
                            icon="done_all"
                            label="Submit Demo!"
                        />
                    </ButtonWrapper>
                </form>
            </div>
        </div>
    )
}

export default AddDemo
