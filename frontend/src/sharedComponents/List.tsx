import styled from 'styled-components'

import { colors } from 'theme'

const OrderedList = styled.ol`
    color: ${colors.pear.base};
`

const UnorderedList = styled.ul`
    color: ${colors.pear.base};
`

const ListItem = styled.li`
    line-height: 1.5;
`

export {
    OrderedList,
    UnorderedList,
    ListItem
}
