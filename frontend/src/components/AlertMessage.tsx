import { useEffect, useContext } from 'react'
import styled from 'styled-components'

import { Paragraph, Button } from 'sharedComponents'
import { context } from 'context'
import { colors } from 'theme'

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
    border: 2px solid ${colors.pear.base};
    background-color: white;
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
        if (state.message.timeToLiveMS) {
            setTimeout(() => {
                dispatch({ type: 'DELETE_MESSAGE' })
            }, state.message.timeToLiveMS)
        }
    }, [])

    return (
        <AlertMessagePositioner>
            <AlertMessageWrapper timeToLiveMS={state.message.timeToLiveMS}>
                <Paragraph style={{ color: colors.pear.base }}>{state.message.body}</Paragraph>
                <Button onClick={handleSubmit} variation="primary">Ok!</Button>
            </AlertMessageWrapper>
        </AlertMessagePositioner>
    )
}

export default AlertMessage
