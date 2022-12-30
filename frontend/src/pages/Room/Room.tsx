import { Loading } from 'sharedComponents'
import { useParams, useNavigate } from 'react-router-dom'
import { useMemo, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { ApolloError, gql, useMutation, useSubscription, } from '@apollo/client'
import styled from 'styled-components'

import { logger, sanitizeRoomId } from 'utilities'
import { context } from 'context'
import { TRoom, TRoomMemberChange } from '../../types'
import { Conclusion, RoomMembers, Signup, Voting, Admin, VotingSplash } from './components'
import MemberActions from './components/MemberActions'

const Sidebar = styled.div`
    width: 250px;
    margin-right: 1rem;


    button {
        margin-bottom: 0;
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
            demos {
                demo,
                id,
                presenter
            }
            members {
                name
                id
            }
            votes {
                userId
                demoId
                id
            }
        }
    }
`

const MEMBER_SUBSCRIPTION = gql`
  subscription Member($roomId: String!) {
    member(roomId: $roomId) {
        userId
        roomId
        status
        userName
    }
  }
`

const ROOM_SUBSCRIPTION = gql`
subscription Room($roomId: String!) {
    room(roomId: $roomId) {
       roomId,
       status,
       maxVotes
    }
  }
`

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: start;
`

const Room = () => {
    const { roomId } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const { dispatch, state } = useContext(context)
    const navigate = useNavigate()
    const [isSplashing, setIsSplashing] = useState(true)
    const splashTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const onJoinRoomSuccess = useCallback(({ joinRoom }: { joinRoom: TRoom }) => {
        dispatch({
            type: 'ENTER_ROOM',
            data: joinRoom
        })
        setIsLoading(false)
    }, [])
    const onJoinRoomFailure = useCallback((error: ApolloError) => {
        dispatch({ type: 'ADD_MESSAGE', data: { message: error.message } })
        setIsLoading(false)
        navigate('/')
    }, [])
    const [joinRoomMutation] = useMutation<any>(JOIN_ROOM_MUTATION, {
        onCompleted: onJoinRoomSuccess,
        onError: onJoinRoomFailure
    })

    useSubscription<{ member: TRoomMemberChange }>(MEMBER_SUBSCRIPTION, {
        variables: {
            roomId
        },
        onError: (error) => {
            logger(error)
            dispatch({
                type: 'ADD_MESSAGE',
                data: {
                    message: 'Hmm something went wrong, try reloading.'
                }
            })
        },
        onData: ({ data }) => {
            if (!state.room || !data.data) return
            const { userId, status, userName } = data.data.member
            if (status === 'join') {
                dispatch({
                    type: 'ADD_MEMBERS',
                    data: [{ id: userId, name: userName }]
                })
            }
        },
    })

    useSubscription<{ room: TRoom }>(ROOM_SUBSCRIPTION, {
        variables: {
            roomId
        },
        onError: (error) => {
            logger(error)
            dispatch({
                type: 'ADD_MESSAGE',
                data: {
                    message: 'Hmm something went wrong, try reloading.'
                }
            })
        },
        onData: ({ data }) => {
            if (!state.room || !data.data) return

            const { status, maxVotes: updatedMaxVotes } = data.data.room
            dispatch({ type: 'UPDATE_ROOM', data: { status, ...(updatedMaxVotes ? { maxVotes: updatedMaxVotes } : {}) } })
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

    useEffect(() => {
        if (!state.room) return
        if (state.room.status === 'voting' || state.room.status === 'conclusion') setIsSplashing(true)
        splashTimeoutRef.current = setTimeout(() => setIsSplashing(false), 300000)
    }, [state.room && state.room.status])

    const Content = useMemo(() => {
        if (!state.room) return

        switch (state.room.status) {
            case 'signup': {
                return <Signup room={state.room} />
            }
            case 'voting': {
                return <Voting room={state.room} />
            }
            case 'conclusion': {
                return <Conclusion room={state.room} />
            }
        }
    }, [state.room, isSplashing])

    useEffect(() => {
        if (state.room && state.room.status === 'deletion') {
            dispatch({ type: 'ADD_MESSAGE', data: { message: 'Room has closed.' } })
            navigate('/')
        }
    }, [state.room && state.room.status])

    if (isLoading) return <Loading />

    if (!state.room || !state.room.members) return <p>No details</p>

    if (state.room.status === 'voting' && isSplashing) {
        return <VotingSplash room={state.room} />
    }

    if (state.room.status === 'conclusion' && isSplashing) {
        return <p>Conclusion splashing</p>
    }

    return (
        <Wrapper>
            <Sidebar>
                <MemberActions />
                <RoomMembers />
                <Admin />
            </Sidebar>
            {Content}
        </Wrapper>
    )
}
export default Room
