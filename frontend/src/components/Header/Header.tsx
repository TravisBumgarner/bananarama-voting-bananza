import styled from 'styled-components'

import { Link } from 'react-router-dom'
import { Heading } from 'sharedComponents'

const Header = () => {
    return (
        <Link style={{ textDecoration: 'none' }} to="/">
            <Heading.H1>
                Bananarama Voting Bananza!
            </Heading.H1>
        </Link>
    )
}

export default Header
