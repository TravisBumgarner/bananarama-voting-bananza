import { Heading, Button, LabelAndInput, Loading } from 'sharedComponents'
import { useParams, useNavigate } from 'react-router-dom'
import { useMemo, useContext, useState, useCallback, useEffect } from 'react'
import { sanitizeRoomId, logger } from 'utilities'
import { ApolloError, gql, useLazyQuery, useMutation, } from '@apollo/client'

import { context } from 'context'
import { TRoom, TParticipant, TErrorMessages } from '../types'

const JOIN_ROOM_MUTATION = gql`
    mutation JoinRoom($roomId: String!, $memberId: String!, $memberName: String!) {
        joinRoom(roomId: $roomId, memberId: $memberId, memberName: $memberName){
            id
            ownerId
            maxVotes
            icon
            members {
                name,
                id
            }
        }
    }
`

const Room = () => {
    const { roomId } = useParams()
    const sanitizedRoomId = useMemo(() => sanitizeRoomId(roomId || ''), [roomId])
    const [isLoading, setIsLoading] = useState(true)
    const { dispatch, state } = useContext(context)
    const [details, setDetails] = useState<TRoom | null>(null)

    const onGetRoomDetailsSuccess = useCallback(({ joinRoom }: { joinRoom: TRoom }) => {
        setDetails(joinRoom)
        setIsLoading(false)
    }, [])
    const onGetRoomDetailsError = useCallback((error: ApolloError) => {
        dispatch({ type: 'ADD_MESSAGE', data: { message: 'Something went wrong joining the room', timeToLiveMS: 5000 } })
        logger(error.message)
        setIsLoading(false)
    }, [])
    const [joinRoomMutation] = useMutation<any>(JOIN_ROOM_MUTATION, {
        onCompleted: onGetRoomDetailsSuccess,
        onError: onGetRoomDetailsError
    })

    useEffect(() => {
        if (state.name.length === 0) return

        joinRoomMutation({
            variables: {
                memberName: state.name,
                memberId: state.name,
                roomId
            }
        })
    }, [sanitizeRoomId, state.name])

    if (isLoading) return <Loading />

    return (
        <div>
            <Heading.H1>
                Bananarama Voting Bananza
            </Heading.H1>
            <p>{sanitizedRoomId}</p>
            <ul>Members
                {details?.members.map(({ name, id }) => <li key={id}>{name}</li>)}
            </ul>
        </div>
    )
}
export default Room
