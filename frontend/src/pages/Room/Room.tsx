import { Button, Icon, Loading } from 'sharedComponents'
import { useParams, useNavigate } from 'react-router-dom'
import { useMemo, useContext, useState, useCallback, useEffect } from 'react'
import { ApolloError, gql, useMutation, useSubscription, } from '@apollo/client'
import styled from 'styled-components'

import { Exactly, logger, sanitizeRoomId } from 'utilities'
import { context } from 'context'
import { colors } from 'theme'
import { TRoom, TMemberChange, TRoomUpdate } from '../../types'
import { Conclusion, Participants, Signup, Voting } from './components'

const Sidebar = styled.div`
    min-width: 215px;
    margin-right: 1rem;

    button {
        margin-top: 0;
    }
`

const JOIN_ROOM_MUTATION = gql`
    mutation JoinRoom($roomId: String!, $userId: String!, $userName: String!) {
        joinRoom(roomId: $roomId, userId: $userId, userName: $userName){
            id
            ownerId
            maxVotes
            icon
            status
            entries {
                entry,
                id,
                userId
            }
            members {
                name
                id
            }
            votes {
                userId
                entryId
                id
            }
        }
    }
`

const UPDATE_ROOM_MUTATION = gql`
    mutation UpdateRoom($userId: String!, $roomId: String!, $status: RoomStatusEnum!) {
        updateRoom(userId: $userId, roomId: $roomId, status: $status) {
            id,
            status
        }
    }    
`

const MEMBER_CHANGE_SUBSCRIPTION = gql`
  subscription MemberChange {
    memberChange {
        userId
        roomId
        status
        userName
    }
  }
`

const ROOM_UPDATE_SUBSCRIPTION = gql`
  subscription RoomUpdate {
    roomUpdate {
       roomId,
       status
    }
  }
`

const Wrapper = styled.div`
    display: flex;

    div:last-child{
        width: 100%;
    }
`

const Room = () => {
    const { roomId } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const { dispatch, state } = useContext(context)
    const navigate = useNavigate()

    const onJoinRoomSuccess = useCallback(({ joinRoom }: { joinRoom: TRoom }) => {
        const initialMembers = joinRoom.members.reduce((accum, current) => {
            accum[current.id] = current.name
            return accum
        }, {} as Record<string, string>)

        dispatch({
            type: 'ENTER_ROOM',
            data: joinRoom // Shouldnt be all data
        })
        dispatch({
            type: 'ADD_USERS',
            data: initialMembers
        })
        dispatch({
            type: 'ADD_ENTRIES',
            data: joinRoom.entries
        })
        dispatch({
            type: 'ADD_VOTES',
            data: joinRoom.votes
        })

        setIsLoading(false)
    }, [])
    const onJoinRoomFailure = useCallback((error: ApolloError) => {
        dispatch({ type: 'ADD_MESSAGE', data: { message: error.message, timeToLiveMS: 5000 } })
        setIsLoading(false)
        navigate('/')
    }, [])
    const [joinRoomMutation] = useMutation<any>(JOIN_ROOM_MUTATION, {
        onCompleted: onJoinRoomSuccess,
        onError: onJoinRoomFailure
    })

    const onUpdateRoomSuccess = useCallback((data: { updateRoom: Exactly<TRoom, 'status'> }) => {
        if (!state.room) return // This shouldn't fire before the room's details have been populated
        dispatch({
            type: 'UPDATE_ROOM',
            data: { status: data.updateRoom.status }
        })
        setIsLoading(false)
    }, [state.room])
    const onUpdateRoomError = useCallback((error: ApolloError) => {
        dispatch({ type: 'ADD_MESSAGE', data: { message: error.message, timeToLiveMS: 5000 } })
        setIsLoading(false)
    }, [])
    const [updateRoomMutation] = useMutation<any>(UPDATE_ROOM_MUTATION, {
        onCompleted: onUpdateRoomSuccess,
        onError: onUpdateRoomError
    })

    useSubscription<{ memberChange: TMemberChange }>(MEMBER_CHANGE_SUBSCRIPTION, {
        onError: (error) => {
            logger(error)
            dispatch({
                type: 'ADD_MESSAGE',
                data: {
                    message: 'Failed to do the thing.'
                }
            })
        },
        onData: ({ data }) => {
            if (!state.room || !data.data) return // This shouldn't fire before the room's details have been populated

            const { userId, status, userName } = data.data.memberChange
            if (status === 'join') {
                dispatch({
                    type: 'ADD_USERS',
                    data: { [userId]: userName }
                })
            }
        },
    })

    useSubscription<{ roomUpdate: TRoomUpdate }>(ROOM_UPDATE_SUBSCRIPTION, {
        onError: (error) => {
            logger(error)
            dispatch({
                type: 'ADD_MESSAGE',
                data: {
                    message: 'Failed to update room.'
                }
            })
        },
        onData: ({ data }) => {
            if (!state.room || !data.data) return // This shouldn't fire before the room's details have been populated

            const { status, roomId: roomIdToUpdate } = data.data.roomUpdate
            // For now, all events for all rooms are broadcast everywhere.
            if (roomIdToUpdate === state.room.id) {
                dispatch({ type: 'UPDATE_ROOM', data: { status } })
            }
        },
    })

    useEffect(() => {
        if (!state.user || state.user.name.length === 0) {
            // Don't join room until user has entered their name.
            return
        }

        joinRoomMutation({
            variables: {
                userName: state.user.name,
                userId: state.user.id,
                roomId
            }
        })
    }, [sanitizeRoomId, state.user])

    const handleStatusChange = useCallback((status: TRoom['status']) => {
        if (!state.room) return

        updateRoomMutation({ variables: { status, userId: state.user!.id, roomId: state.room.id } })
    }, [state.room])

    const Controls = useMemo(() => {
        if (!state.room || !state.user || state.room.ownerId !== state.user.id || state.room.status === 'conclusion') return null

        if (state.room.status === 'signup') {
            return (
                <Button
                    fullWidth
                    variation="pear"
                    onClick={() => handleStatusChange('voting')}
                >Start Voting <Icon color={colors.pear.base} name="how_to_vote" />
                </Button>
            )
        }
        if (state.room.status === 'voting') {
            return (
                <Button
                    fullWidth
                    variation="pear"
                    onClick={() => handleStatusChange('conclusion')}
                >Announce Results <Icon color={colors.pear.base} name="campaign" />
                </Button>
            )
        }
    }, [state.room, state.user])

    const Content = useMemo(() => {
        if (!state.room) return

        switch (state.room.status) {
            case 'signup': {
                return <Signup />
            }
            case 'voting': {
                return <Voting />
            }
            case 'conclusion': {
                return <Conclusion />
            }
        }
    }, [state.room])

    if (isLoading) return <Loading />

    if (!state.room || !state.users) return <p>no details</p>

    return (
        <Wrapper>
            <Sidebar>
                {Controls}
                <Participants />
            </Sidebar>
            {Content}
        </Wrapper>
    )
}
export default Room
