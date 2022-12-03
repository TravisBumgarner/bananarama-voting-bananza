import { gql, useMutation, } from '@apollo/client'
import { useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { Heading, Button, LabelAndInput } from 'sharedComponents'
import { context } from 'context'

const CREATE_ROOM_MUTATION = gql`
    mutation CreateRoom {
        createRoom {
            id
        }
    }    
`

const Lobby = () => {
    const [createRoomMutation] = useMutation<{ createRoom: { id: string } }>(CREATE_ROOM_MUTATION)
    const navigate = useNavigate()
    const { dispatch } = useContext(context)
    const [roomName, setRoomName] = useState<string>('')

    const createRoom = useCallback(async () => {
        const response = await createRoomMutation()
        if (response.data?.createRoom.id) {
            navigate(response.data?.createRoom.id)
        } else {
            dispatch({ type: 'ADD_MESSAGE', data: { message: 'Failed to create room :(' } })
        }
    }, [])

    const joinRoom = useCallback(() => {
        console.log('hi')
        navigate(roomName)
    }, [roomName])

    return (
        <div>
            <Heading.H1>
                Bananarama Voting Bananza
            </Heading.H1>
            <Button onClick={createRoom} fullWidth type="button" variation="primary">
                Create Room
            </Button>
            <p style={{ textAlign: 'center' }}>OR</p>
            <div>
                <LabelAndInput
                    name="joinroom"
                    value={roomName}
                    handleChange={(value) => setRoomName(value)}
                />
                <Button fullWidth onClick={joinRoom} type="button" variation="primary">
                    Join Room
                </Button>
            </div>
        </div>
    )
}

export default Lobby
