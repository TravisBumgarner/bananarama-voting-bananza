import { useContext, useState } from 'react'
import { Button, Heading, Modal, Paragraph } from 'sharedComponents'

import styled from 'styled-components'

import { context } from 'context'

import { snippets } from 'theme'
import { AddDemoModal } from '../../../modals'

const MemberActionsWrapper = styled.div`
    ${snippets.section}
    margin-bottom: 1rem;
    padding: 1rem;
`

const MemberActions = () => {
    const { state } = useContext(context)
    const [showAddDemoModal, setShowAddDemoModal] = useState(false)

    if (!state.room || !state.user || state.room.ownerId !== state.user.id) return null

    let content
    if (state.room.status === 'signup') {
        content = (
            <>
                <Button
                    type="button"
                    fullWidth
                    variation="banana"
                    label="Add Demo"
                    icon="add"
                    onClick={() => setShowAddDemoModal(true)}
                />
                <Modal
                    showModal={showAddDemoModal}
                    closeModal={() => setShowAddDemoModal(false)}
                    contentLabel="Add Demo!"
                >
                    <AddDemoModal closeModal={() => setShowAddDemoModal(false)} />
                </Modal>
            </>
        )
    }
    if (state.room.status === 'voting') {
        content = (
            <div>
                <Paragraph>Drag the bananas onto your favorite demos!</Paragraph>
                <p style={{ fontSize: '3rem', margin: 0, textAlign: 'center' }}>🍌🍌🍌</p>
            </div>
        )
    }
    if (state.room.status === 'conclusion') {
        content = (
            <>
            </>
        )
    }

    return (
        <MemberActionsWrapper>
            <Heading.H2>MemberActions</Heading.H2>
            {content}
        </MemberActionsWrapper>
    )
}

export default MemberActions
