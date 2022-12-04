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
    border: 2px solid ${colors.PRIMARY.base};
    background-color: white;
    clip-path: polygon(3% 0, 7% 1%, 11% 0%, 16% 2%, 20% 0, 23% 2%, 28% 2%, 32% 1%, 35% 1%, 39% 3%, 41% 1%, 45% 0%, 47% 2%, 50% 2%, 53% 0, 58% 2%, 60% 2%, 63% 1%, 65% 0%, 67% 2%, 69% 2%, 73% 1%, 76% 1%, 79% 0, 82% 1%, 85% 0, 87% 1%, 89% 0, 92% 1%, 96% 0, 98% 3%, 99% 3%, 99% 6%, 100% 11%, 98% 15%, 100% 21%, 99% 28%, 100% 32%, 99% 35%, 99% 40%, 100% 43%, 99% 48%, 100% 53%, 100% 57%, 99% 60%, 100% 64%, 100% 68%, 99% 72%, 100% 75%, 100% 79%, 99% 83%, 100% 86%, 100% 90%, 99% 94%, 99% 98%, 95% 99%, 92% 99%, 89% 100%, 86% 99%, 83% 100%, 77% 99%, 72% 100%, 66% 98%, 62% 100%, 59% 99%, 54% 99%, 49% 100%, 46% 98%, 43% 100%, 40% 98%, 38% 100%, 35% 99%, 31% 100%, 28% 99%, 25% 99%, 22% 100%, 19% 99%, 16% 100%, 13% 99%, 10% 99%, 7% 100%, 4% 99%, 2% 97%, 1% 97%, 0% 94%, 1% 89%, 0% 84%, 1% 81%, 0 76%, 0 71%, 1% 66%, 0% 64%, 0% 61%, 0% 59%, 1% 54%, 0% 49%, 1% 45%, 0% 40%, 1% 37%, 0% 34%, 1% 29%, 0% 23%, 2% 20%, 1% 17%, 1% 13%, 0 10%, 1% 6%, 1% 3%); 
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
                <Paragraph style={{ color: colors.PRIMARY.base }}>{state.message.body}</Paragraph>
                <Button onClick={handleSubmit} variation="primary">Ok!</Button>
            </AlertMessageWrapper>
        </AlertMessagePositioner>
    )
}

export default AlertMessage
