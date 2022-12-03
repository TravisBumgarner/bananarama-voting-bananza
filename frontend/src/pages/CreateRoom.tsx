import { Heading, Button } from 'sharedComponents'
import {
    gql,
    useMutation,
} from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { context } from 'context'
import { useContext } from 'react'

const CREATE_ROOM_MUTATION = gql`
    mutation CreateRoom {
        createRoom {
            id
        }
    }    
`

const CreateRoom = () => {
    const [createRoomMutation] = useMutation<{ createRoom: { id: string } }>(CREATE_ROOM_MUTATION)
    const navigate = useNavigate()
    const { dispatch } = useContext(context)

    const createRoom = async () => {
        const response = await createRoomMutation()
        if (response.data?.createRoom.id) {
            navigate(response.data?.createRoom.id)
        } else {
            dispatch({ type: 'ADD_MESSAGE', data: { message: 'Failed to create room :(' } })
        }
    }

    return (
        <div>
            <Heading.H1>
                Bananarama Voting Bananza
            </Heading.H1>
            <Button onClick={createRoom} fullWidth type="button" variation="primary">
                Create Room
            </Button>
        </div>
    )
}
export default CreateRoom
