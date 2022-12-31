import { gql, useMutation, } from '@apollo/client'
import { useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { Button, Input } from 'sharedComponents'
import { context } from 'context'
import { colors, snippets } from 'theme'

const Wrapper = styled.div`
    ${snippets.section};
    padding: 1rem;
`

const FabulousOrWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;;

    div {
        border: 1px solid ${colors.supergreen.base};
        width:100%;
        margin: 0 1rem;
    }

    p {
        text-align: center;
        font-size: 2rem;
        color: ${colors.supergreen.base};
        margin: 0.5rem 0;
    }
`

const CREATE_ROOM_MUTATION = gql`
    mutation CreateRoom($ownerId: String! $ownerName: String!) {
        createRoom(ownerId: $ownerId, ownerName: $ownerName) {
            id
        }
    }    
`

const Lobby = () => {
    const [createRoomMutation] = useMutation<{ createRoom: { id: string } }>(CREATE_ROOM_MUTATION)
    const navigate = useNavigate()
    const { dispatch, state: { user } } = useContext(context)
    const [roomId, setRoomId] = useState('')

    const createRoom = useCallback(async () => {
        if (!user) return

        const response = await createRoomMutation({ variables: { ownerId: user.id, ownerName: user.name } })
        if (response.data?.createRoom.id) {
            navigate(response.data?.createRoom.id)
        } else {
            dispatch({ type: 'ADD_MESSAGE', data: { message: 'Failed to create room :(' } })
        }
    }, [!!user])

    const joinRoom = useCallback(async () => {
        navigate(roomId)
    }, [roomId])

    return (
        <Wrapper>
            <Button
                label="Create Room"
                icon="door_front"
                onClick={createRoom}
                fullWidth
                type="button"
                variation="banana"
            />
            <FabulousOrWrapper>
                <div />
                <p>OR</p>
                <div />
            </FabulousOrWrapper>
            <div>
                <Input
                    name="joinroom"
                    value={roomId}
                    label="Enter an Existing Room Name"
                    handleChange={(value: string) => setRoomId(value)}
                />
                <Button
                    disabled={roomId.length === 0}
                    label="Join Room"
                    icon="door_open"
                    fullWidth
                    onClick={joinRoom}
                    type="button"
                    variation="banana"
                />
            </div>
        </Wrapper>
    )
}

export default Lobby
