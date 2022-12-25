import { gql, useSubscription } from '@apollo/client'
import { useContext, useState } from 'react'
import styled from 'styled-components'

import { Button, Heading, Modal, RoomWrapper } from 'sharedComponents'
import { context } from 'context'
import { snippets } from 'theme'
import { TDemo } from 'types'
import { logger } from 'utilities'
import { AddDemoModal } from '../../../modals'

const DEMO_SUBSCRIPTION = gql`
  subscription Demo($roomId: String!) {
    demo(roomId: $roomId) {
        roomId
        presenter
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
    ${snippets.subSection};
    border-radius: 1rem;
    margin: 0 0 1rem 0;
    padding: 1rem;
    box-sizing: border-box;
`

const Demo = ({ demo }: { demo: TDemo }) => {
    return (
        <DemoWrapper>
            <Heading.H3> &quot;{demo.demo}&quot; - {demo.presenter}</Heading.H3>
        </DemoWrapper>
    )
}

const Signup = () => {
    const [showAddDemoModal, setShowAddDemoModal] = useState(false)
    const { state, dispatch } = useContext(context)

    useSubscription<{ demo: TDemo }>(DEMO_SUBSCRIPTION, {
        variables: {
            roomId: state.room!.id
        },
        onError: (error) => {
            logger(error)
            dispatch({
                type: 'ADD_MESSAGE',
                data: {
                    message: 'Something went wrong.'
                }
            })
        },
        onData: ({ data }) => {
            if (!state.room || !data.data) return
            const { presenter, roomId, demo, id } = data.data.demo
            dispatch({
                type: 'ADD_DEMOS',
                data: [{
                    presenter, roomId, demo, id
                }]
            })
        },
    })

    return (
        <div>
            <RoomWrapper>
                <Heading.H2>Demos</Heading.H2>
                <DemosWrapper>
                    {state.room!.demos.map((demo) => <Demo demo={demo} key={demo.id} />)}
                </DemosWrapper>
                <Button
                    type="button"
                    fullWidth
                    variation="banana"
                    label="Add Demo"
                    icon="add"
                    onClick={() => setShowAddDemoModal(true)}
                />
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
