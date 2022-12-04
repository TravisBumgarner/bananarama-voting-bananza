import { useContext } from 'react'
import styled from 'styled-components'

import { Heading } from 'sharedComponents'
import { context } from 'context'
import { colors } from 'theme'

const ListItem = styled.li`
    list-style: none;
    color: ${colors.apple.base};
    margin: 0;
    padding: 0
`

const List = styled.ul`
    margin: 0;
    padding: 0;
`

const ParticipantsWrapper = styled.div`
    border-radius: 1rem;
    border: 4px solid ${colors.apple.base};
    padding: 1rem;
    width: 200px;
`

const Participants = () => {
    const { state } = useContext(context)
    return (
        <ParticipantsWrapper>
            <Heading.H3>Participants</Heading.H3>
            <List>
                {Object.keys(state.users).map((id) => <ListItem key={id}>{state.users[id]}</ListItem>)}
            </List>
        </ParticipantsWrapper>
    )
}

export default Participants
