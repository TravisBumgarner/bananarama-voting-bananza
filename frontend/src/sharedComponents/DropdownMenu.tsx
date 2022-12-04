import styled from 'styled-components'

import { Button } from 'sharedComponents'
import { colors } from 'theme'

const StyledNav = styled.ul`
    z-index: 998;
    position: absolute;
    width: 240px;
    right: 0;
    display: ${({ showMenu }: { showMenu: boolean }) => (showMenu ? 'block' : 'none')};
    list-style: none;
    flex-direction: row;
    padding: 1rem;
    background-color: ${colors.PRIMARY.base};
    border: 4px solid ${colors.PRIMARY.base};
    margin: 0.5rem;
    text-transform: uppercase;

    ${Button} {
        margin: 0.5rem 0; // For whatever reason I cannot figure out how to get a button to fit in a dropdown. 
    }
`

type DropdownMenuProps = {
    title: string
    children: any[]
}

const DropdownMenu = ({ title, children }: DropdownMenuProps) => {
    const [showMenu, setShowMenu] = useState<boolean>(false)

    const handleClose = () => setShowMenu(false)

    useEffect(() => {
        if (showMenu) {
            window.addEventListener('click', handleClose)
        }
        return () => window.removeEventListener('click', handleClose)
    }, [showMenu])

    return (
        <div style={{ position: 'relative' }}>
            <Button variation="secondary" onClick={() => setShowMenu(!showMenu)}>{title}</Button>
            <StyledNav showMenu={showMenu}>
                {children.map((child, index) => <li key={index}>{child}</li>)} {/* eslint-disable-line */}
            </StyledNav>
        </div>
    )
}
export default DropdownMenu
