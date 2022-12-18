import { Button, Heading, Loading } from 'sharedComponents'
import { useParams, useNavigate } from 'react-router-dom'
import { useMemo, useContext, useState, useCallback, useEffect } from 'react'
import { ApolloError, gql, useMutation, useSubscription, } from '@apollo/client'
import styled from 'styled-components'

import { Exactly, logger, sanitizeRoomId } from 'utilities'
import { context } from 'context'
import { colors } from 'theme'
import { TRoom, TRoomMemberChange, TRoomUpdate } from '../../types'
import { Conclusion, RoomMembers, Signup, Voting } from './components'

const AdminWrapper = styled.div`
    border: 2px solid ${colors.blueberry.base};
    border-radius: 1rem;
    margin-bottom: 1rem;
    padding: 1rem 1rem 0 1rem;
`

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

const UPDATE_ROOM_MUTATION = gql`
    mutation UpdateRoom($userId: String!, $roomId: String!, $status: RoomStatusEnum!, $maxVotes: Int) {
        updateRoom(userId: $userId, roomId: $roomId, status: $status, maxVotes: $maxVotes) {
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
       status,
       maxVotes
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
    const [maxVotes, setMaxVotes] = useState(2)

    const onJoinRoomSuccess = useCallback(({ joinRoom }: { joinRoom: TRoom }) => {
        dispatch({
            type: 'ENTER_ROOM',
            data: joinRoom
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

    useSubscription<{ memberChange: TRoomMemberChange }>(MEMBER_CHANGE_SUBSCRIPTION, {
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
                    type: 'ADD_MEMBERS',
                    data: [{ id: userId, name: userName }]
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

            const { status, roomId: roomIdToUpdate, maxVotes: updatedMaxVotes } = data.data.roomUpdate
            // For now, all events for all rooms are broadcast everywhere.
            if (roomIdToUpdate === state.room.id) {
                dispatch({ type: 'UPDATE_ROOM', data: { status, ...(updatedMaxVotes ? { maxVotes: updatedMaxVotes } : {}) } })
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

    const handleRoomChange = useCallback((status: TRoom['status']) => {
        if (!state.room) return

        const variables = {
            status,
            userId: state.user!.id,
            roomId: state.room.id,
            ...(status === 'voting' ? { maxVotes } : {})
        }

        updateRoomMutation({ variables })
    }, [state.room, maxVotes])

    const copyResults = () => {
        const winnersDetails = state.room!.demos.filter(({ id }) => state.room!.winners.includes(id))
        let message = ''

        if (winnersDetails.length > 1) message += `${winnersDetails.length} way tie!\n`
        message += `${(new Date().toDateString())}\n`
        winnersDetails.forEach(({ userId, demo }) => {
            message += `${state.room!.members.find((member) => member.id === userId)?.name} - ${demo}\n\n`
        })
        navigator.clipboard.writeText(message)
    }

    const Admin = useMemo(() => {
        if (!state.room || !state.user || state.room.ownerId !== state.user.id) return null
        let content
        if (state.room.status === 'signup') {
            content = (
                <>
                    <div>
                        <Button
                            variation="pear"
                            icon="add"
                            type="button"
                            onClick={() => setMaxVotes((prev) => prev + 1)}
                        />
                        <Button
                            variation="banana"
                            type="button"
                            icon="remove"
                            disabled={maxVotes === 1}
                            onClick={() => setMaxVotes((prev) => prev - 1)}
                        />
                        {'🍌'.repeat(maxVotes)}
                    </div>
                    <Button
                        fullWidth
                        type="button"
                        icon="how_to_vote"
                        variation="pear"
                        label="Start Voting"
                        onClick={() => handleRoomChange('voting')}
                    />
                </>
            )
        }
        if (state.room.status === 'voting') {
            content = (
                <Button
                    type="button"
                    fullWidth
                    variation="pear"
                    label="Announce Results"
                    icon="campaign"
                    onClick={() => handleRoomChange('conclusion')}
                />
            )
        }
        if (state.room.status === 'conclusion') {
            content = (
                <>
                    <Button
                        type="button"
                        fullWidth
                        variation="pear"
                        label="Delete Room"
                        icon="delete"
                        onClick={() => console.log('deleting...')}
                    />
                    <Button
                        type="button"
                        fullWidth
                        variation="pear"
                        label="Copy Results"
                        icon="content_copy"
                        onClick={copyResults}
                    />
                </>
            )
        }

        return (
            <AdminWrapper>
                <Heading.H2>Admin</Heading.H2>
                {content}
            </AdminWrapper>
        )
    }, [state.room, state.user, maxVotes])

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

    if (!state.room || !state.room.members) return <p>No details</p>

    return (
        <Wrapper>
            <Sidebar>
                {Admin}
                <RoomMembers />
            </Sidebar>
            {Content}
        </Wrapper>
    )
}
export default Room
