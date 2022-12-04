import styled from 'styled-components'

import { colors } from 'theme'

const H1 = styled.h1`
    font-size: 3rem;
    color: ${colors.BRIGHT4.base};
    margin: 0 0 1rem;
`

const H2 = styled.h2`
    color: ${colors.BRIGHT3.base};
    margin: 0.5rem;
    text-transform: uppercase;
`

const H3 = styled.h3`
    color: ${colors.BRIGHT2.base};
    text-transform: uppercase;
`

const H4 = styled.h4`
    color: ${colors.BRIGHT1.base};
    text-transform: uppercase;
`

export { H1, H2, H3, H4 }
