import { useState, useEffect } from 'react'
import styled from 'styled-components'

import { Button, StyledNavLink } from 'sharedComponents'
import { colors } from 'theme'

const StyledNav = styled.ul`
    position: absolute;
    width: 300px;
    right: 0;
    display: ${({ showNav }: { showNav: boolean }) => (showNav ? 'block' : 'none')};
    list-style: none;
    flex-direction: row;
    padding: 0.5rem;
    border: 2px solid ${colors.PRIMARY.base};
    background-color: ${colors.BACKGROUND.base};
    z-index:998;
    margin: 0.5rem 0 0 0;

    li {
        padding: 10px;
    }
`

const LINKS = [
    { text: 'Home', to: '/' },
]

const Navigation = () => {
    const [showNav, setShowNav] = useState<boolean>(false)

    const handleClose = () => setShowNav(false)

    useEffect(() => {
        if (showNav) {
            window.addEventListener('click', handleClose)
        }
        return () => window.removeEventListener('click', handleClose)
    }, [showNav])

    return (
        <div style={{ position: 'relative' }}>
            <Button variation="primary" onClick={() => setShowNav(!showNav)}>Menu</Button>
            <StyledNav showNav={showNav}>
                {LINKS.map(({ text, to }) => (
                    <li key={to} onClick={() => setShowNav(false)}> {/* eslint-disable-line */}
                        <StyledNavLink addWeightForActiveLink to={to} text={text} />
                    </li>
                ))}
            </StyledNav>
        </div>
    )
}
export default Navigation
