import styled from 'styled-components'

// For More: https://fonts.google.com/icons

type IconProps = {
    name:
    | 'close'
    | 'content_copy'
    | 'add'
    | 'done_all'
    | 'cancel'
    | 'rocket_launch'
    | 'how_to_vote'
    | 'campaign'
    | 'door_open'
    | 'door_front'
    color: string
    onClick?: () => void
}

const Button = styled.button`
    border:0;
    background-color: transparent;
    cursor: pointer;
`

const Icon = ({ name, color, onClick }: IconProps) => {
    return (
        onClick ? (
            <Button onClick={onClick} type="button">
                <span style={{ color }} className="material-symbols-outlined">
                    {name}
                </span>
            </Button>
        ) : (
            <span style={{ color, fontWeight: 900 }} className="material-symbols-outlined">
                {name}
            </span>
        )
    )
}

export default Icon
