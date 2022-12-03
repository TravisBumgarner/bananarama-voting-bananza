import { ApolloError, gql, useLazyQuery, useMutation, } from '@apollo/client'
import { useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { Heading, Button, LabelAndInput } from 'sharedComponents'
import { context } from 'context'
import { logger } from 'utilities'

const CREATE_ROOM_MUTATION = gql`
    mutation CreateRoom($ownerId: String! $ownerName: String!) {
        createRoom(ownerId: $ownerId, ownerName: $ownerName) {
            id
        }
    }    
`

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

const Lobby = () => {
    const [createRoomMutation] = useMutation<{ createRoom: { id: string } }>(CREATE_ROOM_MUTATION)
    const navigate = useNavigate()
    const { dispatch, state } = useContext(context)
    const [roomId, setRoomId] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)

    const onGetRoomDetailsSuccess = useCallback((data: any) => {
        console.log(data)
        setIsLoading(false)
        navigate(roomId)
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

    const createRoom = useCallback(async () => {
        const response = await createRoomMutation({ variables: { ownerId: 'foo', ownerName: state.name } })
        if (response.data?.createRoom.id) {
            navigate(response.data?.createRoom.id)
        } else {
            dispatch({ type: 'ADD_MESSAGE', data: { message: 'Failed to create room :(' } })
        }
    }, [])

    const joinRoom = useCallback(async () => {
        await joinRoomMutation({
            variables: {
                memberName: state.name,
                memberId: state.name,
                roomId
            }
        })
    }, [roomId])

    return (
        <div>
            <Heading.H1>
                Bananarama Voting Bananza
            </Heading.H1>
            <Button disabled={isLoading} onClick={createRoom} fullWidth type="button" variation="primary">
                Create Room
            </Button>
            <p style={{ textAlign: 'center' }}>OR</p>
            <div>
                <LabelAndInput
                    name="joinroom"
                    value={roomId}
                    handleChange={(value) => setRoomId(value)}
                />
                <Button disabled={isLoading} fullWidth onClick={joinRoom} type="button" variation="primary">
                    Join Room
                </Button>
            </div>
        </div>
    )
}

export default Lobby
