import { Heading, Button } from 'sharedComponents'
import {
    gql,
    useMutation,
} from '@apollo/client'
import { useNavigate, useParams } from 'react-router-dom'
import { context } from 'context'
import { useContext, useMemo } from 'react'
import { sanitizeRoomId } from 'utilities'

const CreateRoom = () => {
    const { roomId } = useParams()
    const sanitizedRoomId = useMemo(() => sanitizeRoomId(roomId || ''), [roomId])

    return (
        <div>
            <Heading.H1>
                Bananarama Voting Bananza
            </Heading.H1>
            <p>{sanitizedRoomId}</p>

        </div>
    )
}
export default CreateRoom
