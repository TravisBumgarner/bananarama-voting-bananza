import { ApolloError, gql, useMutation, useSubscription } from '@apollo/client'
import { useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'

import { Button, Heading, Paragraph, RoomWrapper } from 'sharedComponents'
import { context } from 'context'
import { TDemo, TVote } from 'types'
import { logger } from 'utilities'
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
    isCastingVote: boolean
    setIsCastingVote: React.Dispatch<React.SetStateAction<boolean>>
    canVote: boolean
}
const Demo = ({ demo, isCastingVote, setIsCastingVote, canVote }: DemoProps) => {
    const { state, dispatch } = useContext(context)

    const onAddVoteSuccess = useCallback(() => {
        setIsCastingVote(false)
    }, [])

    const onAddVoteFailure = useCallback((error: ApolloError) => {
        dispatch({ type: 'ADD_MESSAGE', data: { message: error.message } })
        setIsCastingVote(false)
    }, [])
    const [addVoteMutation] = useMutation<any>(ADD_VOTE_ACTION_MUTATION, {
        onCompleted: onAddVoteSuccess,
        onError: onAddVoteFailure
    })

    const handleSubmit = useCallback(async () => {
        if (!state.room) return
        setIsCastingVote(true)
        await addVoteMutation({
            variables: {
                userId: state.user!.id,
                roomId: state.room.id,
                demoId: demo.id
            }
        })
    }, [])
    return (
        <DemoWrapper>
            <div>
                <Heading.H3>{demo.demo}</Heading.H3>
                <Paragraph>{demo.presenter}</Paragraph>
            </div>
            <div>
                <Button type="button" label="Vote 🍌" disabled={isCastingVote || !canVote} variation="rotten" onClick={handleSubmit} />
            </div>
        </DemoWrapper>
    )
}

const Voting = () => {
    const { state, dispatch } = useContext(context)
    const [isCastingVote, setIsCastingVote] = useState(false)

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

    const votesCast = useMemo(() => {
        return state.room!.votes.filter(({ userId }) => userId === state.user!.id).length
    }, [state.room!.votes])

    return (
        <RoomWrapper>
            <Heading.H2>Voting</Heading.H2>

            <DemosWrapper>
                {state.room!.demos.map((demo) => (
                    <Demo
                        isCastingVote={isCastingVote}
                        setIsCastingVote={setIsCastingVote}
                        demo={demo}
                        key={demo.id}
                        canVote={state.room!.maxVotes > votesCast}
                    />
                ))}
            </DemosWrapper>
        </RoomWrapper>
    )
}

export default Voting
