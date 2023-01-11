import { ApolloError, gql, useMutation, useSubscription } from '@apollo/client'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { Heading, Paragraph, RoomWrapper } from 'sharedComponents'
import { context } from 'context'
import { TDemo, TRoom, TUser, TVote } from 'types'
import { logger } from 'utilities'
import { useDragAndDrop } from 'hooks'
import DemoWrapper from './DemoWrapper'

const VOTE_SUBSCRIPTION = gql`
  subscription Vote($roomId: String!) {
    vote(roomId: $roomId) {
        roomId
        userId
        demoId
        id
    }
  }
`

const ADD_VOTE_MUTATION = gql`
    mutation AddVote($roomId: String!, $userId: String!, $demoId: String!) {
        addVote(roomId: $roomId, userId: $userId, demoId: $demoId) {
            id
        }
    }    
`

const DELETE_VOTE_MUTATION = gql`
    mutation DeleteVote($roomId: String!, $userId: String!, $voteId: String!) {
        deleteVote(roomId: $roomId, userId: $userId, voteId: $voteId) {
            id
        }
    }    
`

const DemosWrapper = styled.ul`
    list-style: none;
    margin: 1rem 0;
    padding: 0;
`

const VoteCast = ({ vote }: { vote: TVote }) => {
    const [isHovering, setIsHovering] = useState(false)
    const { dispatch } = useContext(context)

    const onDeleteVoteSuccess = useCallback(() => {
        // setIsCastingVote(false)
    }, [])

    const onDeleteVoteFailure = useCallback((error: ApolloError) => {
        dispatch({ type: 'ADD_MESSAGE', data: { message: error.message } })
        // setIsCastingVote(false)
    }, [])
    const [deleteVoteMutation] = useMutation<any>(DELETE_VOTE_MUTATION, {
        onCompleted: onDeleteVoteSuccess,
        onError: onDeleteVoteFailure
    })

    const deleteVote = useCallback(async () => {
        console.log({
            voteId: vote.id,
            userId: vote.userId,
            roomId: vote.roomId
        })
        await deleteVoteMutation({
            variables: {
                voteId: vote.id,
                userId: vote.userId,
                roomId: vote.roomId
            }
        })
    }, [vote.id])

    const handleClick = useCallback(() => {
        deleteVote()
    }, [vote.id])

    const handleMouseOut = useCallback(() => setIsHovering(false), [])
    const handleMouseOver = useCallback(() => setIsHovering(true), [])
    return (
        <div
            onMouseOver={handleMouseOver}
            onFocus={handleMouseOver}
            onMouseOut={handleMouseOut}
            onBlur={handleMouseOut}
            style={{ display: 'inline-block' }}
        >
            <button
                style={{ background: 'transparent', border: 0, fontSize: 'inherit', cursor: 'pointer' }}
                type="button"
                onClick={handleClick}
            >{isHovering ? '❌' : '🍌'}
            </button>
        </div>
    )
}

type DemoProps = {
    demo: TDemo
    // isCastingVote: boolean
    // setIsCastingVote: React.Dispatch<React.SetStateAction<boolean>>
    // canVote: boolean
    binIndex: number
    user: TUser
    room: TRoom
}
const Demo = ({ demo, binIndex, user, room }: DemoProps) => {
    const { dispatch } = useContext(context)
    const { matchedBinIndex, dragEnterCallback, hoveredBinIndex } = useDragAndDrop()
    const [votesCast, setVotesCast] = useState<TVote[]>([])

    const onAddVoteSuccess = useCallback(() => {
        // setIsCastingVote(false)
    }, [])

    const onAddVoteFailure = useCallback((error: ApolloError) => {
        dispatch({ type: 'ADD_MESSAGE', data: { message: error.message } })
        // setIsCastingVote(false)
    }, [])
    const [addVoteMutation] = useMutation<any>(ADD_VOTE_MUTATION, {
        onCompleted: onAddVoteSuccess,
        onError: onAddVoteFailure
    })

    const addVote = useCallback(async () => {
        // setIsCastingVote(true)
        await addVoteMutation({
            variables: {
                userId: user.id,
                roomId: room.id,
                demoId: demo.id
            }
        })
    }, [])

    useEffect(() => {
        if (matchedBinIndex === binIndex) {
            addVote()
        }
    }, [matchedBinIndex])

    // isHovered Currently doesn't work.
    const isHovered = useMemo(() => hoveredBinIndex === binIndex, [hoveredBinIndex, binIndex])
    const onDragEnter = useCallback(() => dragEnterCallback(binIndex), [binIndex])

    useEffect(() => {
        setVotesCast(Object.values(room.votes).filter(({ userId, demoId }) => userId === user.id && demoId === demo.id))
    }, [Object.values(room.votes).length])

    const VotesCast = votesCast.map((vote) => <VoteCast key={vote.id} vote={vote} />)

    return (
        <DemoWrapper
            isHovered={isHovered}
            onDragEnter={onDragEnter}
        // onDragLeave={dragLeaveCallback} currently doesn't work
        >
            <div>
                <Heading.H3>{demo.demo}</Heading.H3>
                <Paragraph>{demo.presenter}</Paragraph>
            </div>
            <div style={{ fontSize: '3rem' }}>
                {VotesCast}
            </div>
        </DemoWrapper>
    )
}

const Voting = ({ room, user }: { room: TRoom, user: TUser }) => {
    const { dispatch } = useContext(context)
    useSubscription<{ vote: TVote }>(VOTE_SUBSCRIPTION, {
        variables: {
            roomId: room.id
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
            if (!data.data) return
            const { userId, demoId, roomId, id } = data.data.vote
            dispatch({
                type: 'ADD_VOTES',
                data: {
                    [id]: { userId, roomId, demoId, id }
                }
            })
        },
    })

    return (
        <RoomWrapper>
            <Heading.H2>Voting</Heading.H2>

            <DemosWrapper>
                {Object.values(room.demos).map((demo, index) => (
                    <Demo
                        demo={demo}
                        key={demo.id}
                        binIndex={index}
                        user={user}
                        room={room}
                    />
                ))}
            </DemosWrapper>
        </RoomWrapper>
    )
}

export default Voting
