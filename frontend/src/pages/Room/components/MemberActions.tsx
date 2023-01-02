import { useContext, useEffect, useMemo, useState } from 'react'
import { Button, Heading, Modal, Paragraph } from 'sharedComponents'

import styled from 'styled-components'

import { context } from 'context'

import { snippets } from 'theme'
import { useDragAndDrop } from 'hooks'
import { AddDemoModal } from '../../../modals'

const MemberActionsWrapper = styled.div`
    ${snippets.section}
    margin-bottom: 1rem;
    padding: 1rem;
`

const VotingBananaWrapper = styled.div<{ disabled: boolean }>`
  width: 50px;
  height: 50px;
  filter: grayscale(${({ disabled }) => (disabled ? 1 : 0)});
  cursor: ${({ disabled }) => (disabled ? ' not-allowed' : ' grab')};
  font-size: 40px;
`
const VotingBanana = ({ bananaIndex, canBeUsed }: { bananaIndex: number, canBeUsed: boolean }) => {
    const { dragStartCallback, dropCallback, matchedItemIndex, matchedBinIndex } = useDragAndDrop()
    const [hasBeenBinned, setHasBeenBinned] = useState(!canBeUsed)

    useEffect(() => {
        if (matchedItemIndex === bananaIndex && matchedBinIndex !== null) {
            setHasBeenBinned(true)
        }
    }, [matchedItemIndex])

    const onDragEnd = () => {
        dropCallback()
    }

    return (
        <VotingBananaWrapper
            disabled={hasBeenBinned}
            onDragStart={() => dragStartCallback(bananaIndex)}
            draggable={!hasBeenBinned}
            onDragEnd={onDragEnd}
        >🍌
        </VotingBananaWrapper>
    )
}

const MemberActions = () => {
    const { state: { room, user } } = useContext(context)
    const [showAddDemoModal, setShowAddDemoModal] = useState(false)
    if (!room || !user) return null

    const voteRemaining = useMemo(() => {
        const votesCast = Object.values(room.votes).filter(({ userId }) => userId === user.id).length
        return room.maxVotes - votesCast
    }, [room.votes.length, room.maxVotes])
    let content
    if (room.status === 'signup') {
        content = (
            <>
                <Button
                    type="button"
                    fullWidth
                    variation="rotten"
                    label="Add Demo"
                    icon="add"
                    onClick={() => setShowAddDemoModal(true)}
                />
                <Modal
                    showModal={showAddDemoModal}
                    closeModal={() => setShowAddDemoModal(false)}
                    contentLabel="Add Demo!"
                >
                    <AddDemoModal room={room} user={user} closeModal={() => setShowAddDemoModal(false)} />
                </Modal>
            </>
        )
    }
    if (room.status === 'voting') {
        content = (
            <div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    {[...Array(room.maxVotes)].map((_, index) => {
                        return <VotingBanana canBeUsed={index < voteRemaining} key={index} bananaIndex={index} /> //eslint-disable-line
                    })}
                </div>
                <Paragraph align="center">Drag bananas to your favorite demos to vote!</Paragraph>
            </div>
        )
    }
    if (room.status === 'conclusion') {
        content = (
            <>
            </>
        )
    }

    return (
        <MemberActionsWrapper>
            <Heading.H2>Menu</Heading.H2>
            {content}
        </MemberActionsWrapper>
    )
}

export default MemberActions
