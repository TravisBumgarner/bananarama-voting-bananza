import styled from 'styled-components'

import { Link } from 'react-router-dom'
import { Heading } from 'sharedComponents'

const HeaderWrapper = styled.div`
    display:flex;
    justify-content: space-between;
    align-items: center;
    margin: 0.5rem;

    & > div:first-child, & > div:nth-child(2) {
        display: flex;
        align-items: center;
    }
`

const Header = () => {
    return (
        <HeaderWrapper>
            <Link style={{ textDecoration: 'none' }} to="/">
                <Heading.H1>
                    Bananarama Voting Bananza
                </Heading.H1>
            </Link>
        </HeaderWrapper>
    )
}

export default Header
