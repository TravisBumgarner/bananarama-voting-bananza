import { useContext, useCallback, useState } from 'react'
import { Button, Heading } from 'sharedComponents'
import { ApolloError, gql, useMutation } from '@apollo/client'

import { TRoom } from 'types'
import { Exactly } from 'utilities'
import { context } from 'context'
import styled from 'styled-components'
import { snippets } from 'theme'

const AdminWrapper = styled.div`
    ${snippets.section}
    margin-bottom: 1rem;
    padding: 1rem;
`

const UPDATE_ROOM_MUTATION = gql`
    mutation UpdateRoom($userId: String!, $roomId: String!, $status: RoomStatusEnum!, $maxVotes: Int) {
        updateRoom(userId: $userId, roomId: $roomId, status: $status, maxVotes: $maxVotes) {
            id,
            status
        }
    }    
`

const Admin = () => {
    const { state, dispatch } = useContext(context)
    const [maxVotes, setMaxVotes] = useState(2)

    if (!state.room || !state.user || state.room.ownerId !== state.user.id) return null

    const onUpdateRoomSuccess = useCallback((data: { updateRoom: Exactly<TRoom, 'status'> }) => {
        if (!state.room) return // This shouldn't fire before the room's details have been populated
        dispatch({
            type: 'UPDATE_ROOM',
            data: { status: data.updateRoom.status }
        })
    }, [state.room])
    const onUpdateRoomError = useCallback((error: ApolloError) => {
        dispatch({ type: 'ADD_MESSAGE', data: { message: error.message } })
    }, [])
    const [updateRoomMutation] = useMutation<any>(UPDATE_ROOM_MUTATION, {
        onCompleted: onUpdateRoomSuccess,
        onError: onUpdateRoomError
    })

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
        winnersDetails.forEach(({ presenter, demo }) => {
            message += `${presenter} - ${demo}\n\n`
        })
        navigator.clipboard.writeText(message)
    }

    let content
    if (state.room.status === 'signup') {
        content = (
            <>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Button
                        variation="rotten"
                        type="button"
                        icon="remove"
                        label="🍌"
                        disabled={maxVotes === 1}
                        onClick={() => setMaxVotes((prev) => prev - 1)}
                    />
                    <Button
                        variation="banana"
                        icon="add"
                        type="button"
                        label="🍌"
                        onClick={() => setMaxVotes((prev) => prev + 1)}
                    />
                </div>
                <div style={{ textAlign: 'center', fontSize: '2rem', margin: '1rem' }}>
                    {'🍌'.repeat(maxVotes)}
                </div>
                <Button
                    fullWidth
                    type="button"
                    icon="how_to_vote"
                    variation="banana"
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
                variation="banana"
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
                    variation="banana"
                    label="Delete Room"
                    icon="delete"
                    onClick={() => console.log('deleting...')}
                />
                <Button
                    type="button"
                    fullWidth
                    variation="rotten"
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
}

export default Admin
