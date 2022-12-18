import { gql, useSubscription } from '@apollo/client'
import { useContext, useState } from 'react'
import styled from 'styled-components'

import { Button, Heading, Modal, RoomWrapper } from 'sharedComponents'
import { context } from 'context'
import { colors } from 'theme'
import { TDemo } from 'types'
import { logger } from 'utilities'
import { AddDemoModal } from '../../../modals'

const ADD_DEMO_SUBSCRIPTION = gql`
  subscription AddDemo {
    addDemo {
        roomId
        userId
        demo,
        id
    }
  }
`

const DemosWrapper = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    max-height:60vh;
    overflow-y: scroll;
`

const DemoWrapper = styled.li`
    border: 4px solid ${colors.blueberry.base};
    border-radius: 1rem;
    margin: 0 0 1rem 0;
    padding: 1rem;
    box-sizing: border-box;
`

const Demo = ({ demo }: { demo: TDemo }) => {
    const { state } = useContext(context)
    return (
        <DemoWrapper>
            <Heading.H3> &quot;{demo.demo}&quot; - {state.users[demo.userId]}</Heading.H3>
        </DemoWrapper>
    )
}

const Signup = () => {
    const [showAddDemoModal, setShowAddDemoModal] = useState(false)
    const { state, dispatch } = useContext(context)

    useSubscription<{ addDemo: TDemo }>(ADD_DEMO_SUBSCRIPTION, {
        onError: (error) => {
            logger(error)
            dispatch({
                type: 'ADD_MESSAGE',
                data: {
                    message: 'Failed to add demo.'
                }
            })
        },
        onData: ({ data }) => {
            if (!state.room || !data.data) return // This shouldn't fire before the room's details have been populated

            const { userId, roomId, demo, id } = data.data.addDemo
            if (roomId === state.room.id) {
                dispatch({
                    type: 'ADD_DEMOS',
                    data: [{
                        userId, roomId, demo, id
                    }]
                })
            }
        },
    })

    return (
        <div>
            <RoomWrapper>
                <Heading.H2>Demos</Heading.H2>
                <Button
                    type="button"
                    fullWidth
                    variation="pear"
                    label="Add Demo"
                    icon="add"
                    onClick={() => setShowAddDemoModal(true)}
                />
                <DemosWrapper>
                    {state.room!.demos.map((demo) => <Demo demo={demo} key={demo.id} />)}
                </DemosWrapper>
            </RoomWrapper>
            <Modal
                showModal={showAddDemoModal}
                closeModal={() => setShowAddDemoModal(false)}
                contentLabel="Add Demo!"
            >
                <AddDemoModal closeModal={() => setShowAddDemoModal(false)} />
            </Modal>
        </div>
    )
}

export default Signup
