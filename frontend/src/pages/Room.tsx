import { Heading } from 'sharedComponents'
import { useParams } from 'react-router-dom'
import { useMemo } from 'react'
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
            <ul>Members</ul>

        </div>
    )
}
export default CreateRoom
