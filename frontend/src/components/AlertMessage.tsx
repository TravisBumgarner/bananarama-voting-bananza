import { useContext } from 'react'
import styled from 'styled-components'

import { Paragraph, Button } from 'sharedComponents'
import { context } from 'context'
import { colors, snippets } from 'theme'

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
    border-radius: 0.7em;
    background-color: ${colors.banana.lighten};
    border: 2px solid ${colors.rotten.base};
    @keyframes fade {
        0%,100% { opacity: 0 }
        10%,90% { opacity: 1 }
    }

    ${() => `
            animation: fade ${DEFAULT_TTL / 1000}s linear;
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

    if (!state.message) return null

    return (
        <AlertMessagePositioner>
            <AlertMessageWrapper>
                <Paragraph style={{ color: colors.rotten.base }}>{state.message.body}</Paragraph>
                <Button type="button" label="Ok!" icon="done_all" onClick={handleSubmit} variation="rotten" />
            </AlertMessageWrapper>
        </AlertMessagePositioner>
    )
}

export default AlertMessage
