import { Button, Heading, Loading, Icon, List } from 'sharedComponents'
import { useParams, useNavigate } from 'react-router-dom'
import { useMemo, useContext, useState, useCallback, useEffect } from 'react'
import { Exactly, sanitizeRoomId } from 'utilities'
import { ApolloError, gql, useMutation, useSubscription, } from '@apollo/client'

import { context } from 'context'
import { colors } from 'theme'
import { TRoom, TMemberChange, TRoomUpdate } from '../types'

const JOIN_ROOM_MUTATION = gql`
    mutation JoinRoom($roomId: String!, $memberId: String!, $memberName: String!) {
        joinRoom(roomId: $roomId, memberId: $memberId, memberName: $memberName){
            id
            ownerId
            maxVotes
            icon
            status
            members {
                name,
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
        memberId
        roomId
        status
        memberName
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

const Room = () => {
    const { roomId } = useParams()
    const sanitizedRoomId = useMemo(() => sanitizeRoomId(roomId || ''), [roomId])
    const [isLoading, setIsLoading] = useState(true)
    const { dispatch, state } = useContext(context)
    const [details, setDetails] = useState<Omit<TRoom, 'members'> | null>(null)
    const [members, setMembers] = useState<Record<string, string> | null>(null)
    const navigate = useNavigate()

    const onJoinRoomSuccess = useCallback(({ joinRoom }: { joinRoom: TRoom }) => {
        const initialMembers = joinRoom.members.reduce((accum, current) => {
            accum[current.id] = current.name //eslint-disable-line
            return accum
        }, {} as Record<string, string>)

        setDetails({ ...joinRoom })
        setMembers(initialMembers)

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
        if (!details) return // This shouldn't fire before the room's details have been populated
        setDetails({ ...details, status: data.updateRoom.status })
        setIsLoading(false)
    }, [details])
    const onUpdateRoomError = useCallback((error: ApolloError) => {
        dispatch({ type: 'ADD_MESSAGE', data: { message: error.message, timeToLiveMS: 5000 } })
        setIsLoading(false)
    }, [])
    const [updateRoomMutation] = useMutation<any>(UPDATE_ROOM_MUTATION, {
        onCompleted: onUpdateRoomSuccess,
        onError: onUpdateRoomError
    })

    useSubscription<{ memberChange: TMemberChange }>(MEMBER_CHANGE_SUBSCRIPTION, {
        onData: ({ data }) => {
            if (!details || !data.data) return // This shouldn't fire before the room's details have been populated

            const { memberId, status, memberName } = data.data.memberChange
            if (status === 'join') {
                setMembers({ ...members, [memberId]: memberName })
            }
        },
    })

    useSubscription<{ roomUpdate: TRoomUpdate }>(ROOM_UPDATE_SUBSCRIPTION, {
        onData: ({ data }) => {
            if (!details || !data.data) return // This shouldn't fire before the room's details have been populated

            const { status, roomId: roomIdToUpdate } = data.data.roomUpdate
            // For now, all events for all rooms are broadcast everywhere.
            if (roomIdToUpdate === details.id) {
                setDetails({ ...details, status })
            }
        },
    })

    useEffect(() => {
        if (state.user.name.length === 0) {
            // Don't join room until user has entered their name.
            return
        }

        joinRoomMutation({
            variables: {
                memberName: state.user.name,
                memberId: state.user.id,
                roomId
            }
        })
    }, [sanitizeRoomId, state.user.id])

    const handleStatusChange = useCallback((status: TRoom['status']) => {
        if (!details) return

        updateRoomMutation({ variables: { status, userId: state.user.id, roomId: details.id } })
    }, [details])

    const copyRoomToClipboard = useCallback(() => {
        navigator.clipboard.writeText(window.location.href)
    }, [window.location.href])

    const Controls = useMemo(() => {
        if (!details || details.ownerId !== state.user.id || details.status === 'conclusion') return null

        if (details.status === 'signup') return <Button variation="pear" onClick={() => handleStatusChange('voting')}>Start Voting</Button>
        if (details.status === 'voting') return <Button variation="pear" onClick={() => handleStatusChange('conclusion')}>Announce Results</Button>
    }, [details, state.user])

    if (isLoading) return <Loading />

    if (!details || !members) return <p>no details</p>
    return (
        <div>
            <Heading.H1>
                Bananarama Voting Bananza
            </Heading.H1>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Heading.H2>Room Name: {sanitizedRoomId}</Heading.H2>
                <Button variation="pear" onClick={copyRoomToClipboard}>Share <Icon color={colors.pear.base} name="content_copy" /></Button>
            </div>
            <Heading.H3>Participants</Heading.H3>
            <List.UnorderedList>
                {Object.keys(members).map((id) => <List.ListItem key={id}>{members[id]}</List.ListItem>)}
            </List.UnorderedList>

            <Heading.H3>Room Details</Heading.H3>
            <List.UnorderedList>
                {Object.keys(details).map((id: keyof typeof details) => <List.ListItem key={id}>{id}: {JSON.stringify(details[id])}</List.ListItem>)}
            </List.UnorderedList>
            {Controls}
        </div>
    )
}
export default Room
