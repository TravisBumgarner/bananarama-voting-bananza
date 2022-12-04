import { gql, useMutation, } from '@apollo/client'
import { useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { Heading, Button, Label, Paragraph } from 'sharedComponents'
import { context } from 'context'

const CREATE_ROOM_MUTATION = gql`
    mutation CreateRoom($ownerId: String! $ownerName: String!) {
        createRoom(ownerId: $ownerId, ownerName: $ownerName) {
            id
        }
    }    
`

const Lobby = () => {
    const [createRoomMutation] = useMutation<{ createRoom: { id: string } }>(CREATE_ROOM_MUTATION)
    const navigate = useNavigate()
    const { dispatch, state } = useContext(context)
    const [roomId, setRoomId] = useState('')
    console.log(state.user)
    const createRoom = useCallback(async () => {
        const response = await createRoomMutation({ variables: { ownerId: state.user.id, ownerName: state.user.name } })
        if (response.data?.createRoom.id) {
            navigate(response.data?.createRoom.id)
        } else {
            dispatch({ type: 'ADD_MESSAGE', data: { message: 'Failed to create room :(' } })
        }
    }, [])

    const joinRoom = useCallback(async () => {
        navigate(roomId)
    }, [roomId])

    return (
        <div>
            <Heading.H1>
                Bananarama Voting Bananza
            </Heading.H1>
            <Button onClick={createRoom} fullWidth type="button" variation="primary">
                Create Room
            </Button>
            <Paragraph style={{ textAlign: 'center' }}>OR</Paragraph>
            <div>
                <Label
                    name="joinroom"
                    value={roomId}
                    label="Enter an Existing Room Name"
                    handleChange={(value) => setRoomId(value)}
                />
                <Button fullWidth onClick={joinRoom} type="button" variation="primary">
                    Join Room
                </Button>
            </div>
        </div>
    )
}

export default Lobby
