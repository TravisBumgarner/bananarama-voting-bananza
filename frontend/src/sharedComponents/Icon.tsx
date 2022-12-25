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
    | 'delete'
    | 'remove'
    | 'door_front'
}

const Icon = ({ name }: IconProps) => {
    return (
        <span style={{ fontWeight: 900 }} className="material-symbols-outlined">
            {name}
        </span>
    )
}

export default Icon
export type {
    IconProps
}
