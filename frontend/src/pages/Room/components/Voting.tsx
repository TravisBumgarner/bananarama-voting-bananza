import { ApolloError, gql, useMutation, useSubscription } from '@apollo/client'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { Heading, Paragraph, RoomWrapper } from 'sharedComponents'
import { context } from 'context'
import { TDemo, TVote } from 'types'
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

const ADD_VOTE_ACTION_MUTATION = gql`
    mutation AddVote($roomId: String!, $userId: String!, $demoId: String!) {
        addVote(roomId: $roomId, userId: $userId, demoId: $demoId) {
            id
        }
    }    
`

const DemosWrapper = styled.ul`
    list-style: none;
    margin: 1rem 0;
    padding: 0;
`

type DemoProps = {
    demo: TDemo
    // isCastingVote: boolean
    // setIsCastingVote: React.Dispatch<React.SetStateAction<boolean>>
    // canVote: boolean
    binIndex: number
}
const Demo = ({ demo, binIndex }: DemoProps) => {
    const { state, dispatch } = useContext(context)

    const { matchedBinIndex, dragEnterCallback, hoveredBinIndex } = useDragAndDrop()

    const onAddVoteSuccess = useCallback(() => {
        // setIsCastingVote(false)
    }, [])

    const onAddVoteFailure = useCallback((error: ApolloError) => {
        dispatch({ type: 'ADD_MESSAGE', data: { message: error.message } })
        // setIsCastingVote(false)
    }, [])
    const [addVoteMutation] = useMutation<any>(ADD_VOTE_ACTION_MUTATION, {
        onCompleted: onAddVoteSuccess,
        onError: onAddVoteFailure
    })

    const castVote = useCallback(async () => {
        // setIsCastingVote(true)
        await addVoteMutation({
            variables: {
                userId: state.user!.id,
                roomId: state.room!.id,
                demoId: demo.id
            }
        })
    }, [])

    useEffect(() => {
        if (matchedBinIndex === binIndex) {
            castVote()
        }
    }, [matchedBinIndex])

    // isHovered Currently doesn't work.
    const isHovered = useMemo(() => hoveredBinIndex === binIndex, [hoveredBinIndex, binIndex])
    const onDragEnter = useCallback(() => dragEnterCallback(binIndex), [binIndex])

    const votesCastByMemberForDemo = useMemo(() => {
        return state.room!.votes.filter(({ userId, demoId }) => userId === state.user?.id && demoId === demo.id).length
    }, [state.room?.votes.length])

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
                {'🍌'.repeat(votesCastByMemberForDemo)}
            </div>
        </DemoWrapper>
    )
}

const Voting = () => {
    const { state, dispatch } = useContext(context)
    useSubscription<{ vote: TVote }>(VOTE_SUBSCRIPTION, {
        variables: {
            roomId: state.room!.id
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
            const { userId, demoId, roomId, id } = data.data.vote
            dispatch({
                type: 'ADD_VOTES',
                data: [{ userId, roomId, demoId, id }]
            })
        },
    })

    return (
        <RoomWrapper>
            <Heading.H2>Voting</Heading.H2>

            <DemosWrapper>
                {state.room!.demos.map((demo, index) => (
                    <Demo
                        demo={demo}
                        key={demo.id}
                        binIndex={index}
                    />
                ))}
            </DemosWrapper>
        </RoomWrapper>
    )
}

export default Voting
