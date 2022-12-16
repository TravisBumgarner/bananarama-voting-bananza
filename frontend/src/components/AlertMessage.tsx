import { useEffect, useContext } from 'react'
import styled from 'styled-components'

import { Paragraph, Button, Icon } from 'sharedComponents'
import { context } from 'context'
import { colors } from 'theme'

const DEFAULT_TTL = 5000

const AlertMessagePositioner = styled.div`
    z-index: 999;
    position: fixed;
    bottom: 5vw;
    left: 5vw;
    right: 5vw;
    display: flex;
    justify-content: center;
    opacity: 1;
`

const AlertMessageWrapper = styled.div`
    display: inline-block;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    font-weight: 700;
    margin: 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 4px solid ${colors.banana.base};
    border-radius: 1rem;
    background-color: ${colors.coffee.base};
    @keyframes fade {
        0%,100% { opacity: 0 }
        10%,90% { opacity: 1 }
    }

    ${({ timeToLiveMS }: { timeToLiveMS: number }) => `
            animation: fade ${timeToLiveMS / 1000}s linear;
        `}

    > ${Paragraph} {
        margin-right: 1rem;
    }
`

const AlertMessage = () => {
    const { state, dispatch } = useContext(context)

    const handleSubmit = () => {
        dispatch({ type: 'DELETE_MESSAGE' })
    }

    useEffect(() => {
        setTimeout(() => {
            dispatch({ type: 'DELETE_MESSAGE' })
        }, state.message?.timeToLiveMS ? state.message.timeToLiveMS : DEFAULT_TTL)
    }, [])

    if (!state.message) return

    return (
        <AlertMessagePositioner>
            <AlertMessageWrapper timeToLiveMS={state.message.timeToLiveMS || DEFAULT_TTL}>
                <Paragraph style={{ color: colors.banana.base }}>{state.message.body}</Paragraph>
                <Button onClick={handleSubmit} variation="pear">Ok! <Icon color={colors.pear.base} name="done_all" /></Button>
            </AlertMessageWrapper>
        </AlertMessagePositioner>
    )
}

export default AlertMessage
