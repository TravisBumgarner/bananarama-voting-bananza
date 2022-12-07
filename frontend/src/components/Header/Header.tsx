import { useCallback, useContext } from 'react'
import { Link } from 'react-router-dom'

import { Button, Heading, Icon } from 'sharedComponents'
import { colors } from 'theme'
import { context } from 'context'
import styled from 'styled-components'

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    
    border: 4px solid ${colors.blueberry.base};
    border-radius: 1rem;
    padding: 1rem;
    margin-bottom: 1rem;

    > button {
        margin-left: 1rem;
    }
`

const Header = () => {
    const { state } = useContext(context)

    const copyRoomToClipboard = useCallback(() => {
        navigator.clipboard.writeText(window.location.href)
    }, [window.location.href])

    return (
        <Wrapper>
            <Link style={{ textDecoration: 'none' }} to="/">
                <Heading.H1>
                    Bananarama Voting Bananza!
                </Heading.H1>
            </Link>
            {
                state.room?.id
                && (
                    <Button
                        variation="pear"
                        onClick={copyRoomToClipboard}
                    >Share Room <Icon color={colors.pear.base} name="content_copy" />
                    </Button>
                )
            }
        </Wrapper>
    )
}

export default Header
