import { Heading, Loading } from 'sharedComponents'
import { useParams, useNavigate } from 'react-router-dom'
import { useMemo, useContext, useState, useCallback, useEffect } from 'react'
import { sanitizeRoomId } from 'utilities'
import { ApolloError, gql, useMutation, useSubscription, } from '@apollo/client'

import { context } from 'context'
import { TRoom, TMemberChange } from '../types'

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

const Room = () => {
    const { roomId } = useParams()
    const sanitizedRoomId = useMemo(() => sanitizeRoomId(roomId || ''), [roomId])
    const [isLoading, setIsLoading] = useState(true)
    const { dispatch, state } = useContext(context)
    const [details, setDetails] = useState<Omit<TRoom, 'members'> | null>(null)
    const [members, setMembers] = useState<Record<string, string> | null>(null)
    const navigate = useNavigate()

    const onGetRoomDetailsSuccess = useCallback(({ joinRoom }: { joinRoom: TRoom }) => {
        const initialMembers = joinRoom.members.reduce((accum, current) => {
            accum[current.id] = current.name //eslint-disable-line
            return accum
        }, {} as Record<string, string>)

        setDetails({ ...joinRoom })
        setMembers(initialMembers)

        setIsLoading(false)
    }, [])
    const onGetRoomDetailsError = useCallback((error: ApolloError) => {
        dispatch({ type: 'ADD_MESSAGE', data: { message: error.message, timeToLiveMS: 5000 } })
        setIsLoading(false)
        navigate('/')
    }, [])
    const [joinRoomMutation] = useMutation<any>(JOIN_ROOM_MUTATION, {
        onCompleted: onGetRoomDetailsSuccess,
        onError: onGetRoomDetailsError
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

    if (isLoading) return <Loading />

    if (!details || !members) return <p>no details</p>
    return (
        <div>
            <Heading.H1>
                Bananarama Voting Bananza
            </Heading.H1>
            <p>{sanitizedRoomId}</p>
            <p>Members</p>
            <ul>
                {Object.keys(members).map((id) => <li key={id}>{members[id]}</li>)}
            </ul>
        </div>
    )
}
export default Room
