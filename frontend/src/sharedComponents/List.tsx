import styled from 'styled-components'

import { colors } from 'theme'

const OrderedList = styled.ol`
    color: ${colors.BRIGHT1.base};
`

const UnorderedList = styled.ul`
    color: ${colors.BRIGHT1.base};
`

const ListItem = styled.li`
    line-height: 1.5;
`

export {
    OrderedList,
    UnorderedList,
    ListItem
}
