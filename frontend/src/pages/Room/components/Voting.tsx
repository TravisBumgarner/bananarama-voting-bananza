import { ApolloError, gql, useMutation, useSubscription } from '@apollo/client'
import { useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'

import { Button, Heading, PageHeadingWrapper } from 'sharedComponents'
import { context } from 'context'
import { colors } from 'theme'
import { TEntry, TVote } from 'types'
import { logger } from 'utilities'

const ADD_VOTE_SUBSCRIPTION = gql`
  subscription AddVote {
    addVote {
        roomId
        userId
        entryId
        id
    }
  }
`

const ADD_VOTE_MUTATION = gql`
    mutation AddVote($roomId: String!, $userId: String!, $entryId: String!) {
        addVote(roomId: $roomId, userId: $userId, entryId: $entryId) {
            id
        }
    }    
`

const EntriesWrapper = styled.ul`
    list-style: none;
    margin: 1rem 0;
    padding: 0;
`

const EntryWrapper = styled.li`
    display: flex;
    flex-direction: row;
    align-items: center;

    > h3 {
        border: 4px solid ${colors.blueberry.base};
        border-radius: 1rem;
        margin: 0.25rem 0.25rem 0.25rem 0;
        padding: 0.5rem;
        flex-grow: 1;
    }

    > button {
        margin: 0.5rem 0 0.5rem 1rem;
    }
`
type EntryProps = {
    entry: TEntry
    isCastingVote: boolean
    setIsCastingVote: React.Dispatch<React.SetStateAction<boolean>>
    canVote: boolean
}
const Entry = ({ entry, isCastingVote, setIsCastingVote, canVote }: EntryProps) => {
    const { state, dispatch } = useContext(context)

    const onAddVoteSuccess = useCallback(() => {
        setIsCastingVote(false)
    }, [])

    const onAddVoteFailure = useCallback((error: ApolloError) => {
        dispatch({ type: 'ADD_MESSAGE', data: { message: error.message, timeToLiveMS: 5000 } })
        setIsCastingVote(false)
    }, [])
    const [addVoteMutation] = useMutation<any>(ADD_VOTE_MUTATION, {
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
                entryId: entry.id
            }
        })
    }, [])

    return (
        <EntryWrapper>
            <Heading.H3> &quot;{entry.entry}&quot; - {state.users[entry.userId]}</Heading.H3>
            <Button disabled={isCastingVote || !canVote} variation="pear" onClick={handleSubmit}>Vote 🍌</Button>
        </EntryWrapper>
    )
}

const Voting = () => {
    const { state, dispatch } = useContext(context)
    const [isCastingVote, setIsCastingVote] = useState(false)

    useSubscription<{ addVote: TVote }>(ADD_VOTE_SUBSCRIPTION, {
        onError: (error) => {
            logger(error)
            dispatch({
                type: 'ADD_MESSAGE',
                data: {
                    message: 'Failed to cast vote.'
                }
            })
        },
        onData: ({ data }) => {
            if (!state.room || !data.data) return // This shouldn't fire before the room's details have been populated

            const { userId, entryId, roomId, id } = data.data.addVote
            if (roomId === state.room.id) {
                dispatch({
                    type: 'ADD_VOTES',
                    data: [{ userId, roomId, entryId, id }]
                })
            }
        },
    })

    const votesCast = useMemo(() => {
        return state.votes.filter(({ userId }) => userId === state.user!.id).length
    }, [state.votes])

    return (
        <div>
            <PageHeadingWrapper>
                <Heading.H2>Voting</Heading.H2>
            </PageHeadingWrapper>
            <EntriesWrapper>
                {state.entries.map((entry) => (
                    <Entry
                        isCastingVote={isCastingVote}
                        setIsCastingVote={setIsCastingVote}
                        entry={entry}
                        key={entry.id}
                        canVote={state.room!.maxVotes > votesCast}
                    />
                ))}
            </EntriesWrapper>
        </div>
    )
}

export default Voting
