import { Button, Heading, Loading, Icon, List } from 'sharedComponents'
import { useParams, useNavigate } from 'react-router-dom'
import { useMemo, useContext, useState, useCallback, useEffect } from 'react'
import { sanitizeRoomId } from 'utilities'
import { ApolloError, gql, useMutation, useSubscription, } from '@apollo/client'

import { context } from 'context'
import { colors } from 'theme'
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
        console.log(joinRoom)
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

    const copyRoomToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
    }

    if (isLoading) return <Loading />

    if (!details || !members) return <p>no details</p>

    console.log(members)
    return (
        <div>
            <Heading.H1>
                Bananarama Voting Bananza
            </Heading.H1>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Heading.H2>Room Name: {sanitizedRoomId}</Heading.H2>
                <Button variation="primary" onClick={copyRoomToClipboard}>Share <Icon color={colors.pear.base} name="content_copy" /></Button>
            </div>
            <Heading.H3>Participants</Heading.H3>
            <List.UnorderedList>
                {Object.keys(members).map((id) => <List.ListItem key={id}>{members[id]}</List.ListItem>)}
            </List.UnorderedList>
        </div>
    )
}
export default Room
