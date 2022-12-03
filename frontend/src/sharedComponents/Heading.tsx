import styled from 'styled-components'

import { colors } from 'theme'

const H1 = styled.h1`
    color: ${colors.PRIMARY.base};
`

const H2 = styled.h2`
    color: ${colors.PRIMARY.base};
    margin: 0.5rem;
    text-transform: uppercase;
`

const H3 = styled.h3`
    color: ${colors.PRIMARY.base};
    text-transform: uppercase;
`

const H4 = styled.h4`
    color: ${colors.PRIMARY.base};
    text-transform: uppercase;
`

export { H1, H2, H3, H4 }
