import { useContext } from 'react'
import styled from 'styled-components'

import { Heading } from 'sharedComponents'
import { context } from 'context'
import { colors } from 'theme'

const ListItem = styled.li`
    list-style: none;
    color: ${colors.banana.base};
    margin: 0;
    padding: 0
`

const List = styled.ul`
    margin: 0;
    padding: 0;
`

const ParticipantsWrapper = styled.div`
    border-radius: 1rem;
    border: 4px solid ${colors.blueberry.base};
    padding: 2rem;
    box-sizing: border-box;
`

const Participants = () => {
    const { state } = useContext(context)
    return (
        <ParticipantsWrapper>
            <Heading.H2>Participants</Heading.H2>
            <List>
                {Object.keys(state.users).map((id) => <ListItem key={id}>{state.users[id]}</ListItem>)}
            </List>
        </ParticipantsWrapper>
    )
}

export default Participants
