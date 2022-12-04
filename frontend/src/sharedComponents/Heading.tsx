import styled from 'styled-components'

import { colors } from 'theme'

const H1 = styled.h1`
    font-size: 3rem;
    color: ${colors.blueberry.base};
    margin: 0 0 1rem;
`

const H2 = styled.h2`
    color: ${colors.banana.base};
    margin: 0.5rem;
    text-transform: uppercase;
`

const H3 = styled.h3`
    color: ${colors.apple.base};
    text-transform: uppercase;
`

const H4 = styled.h4`
    color: ${colors.pear.base};
    text-transform: uppercase;
`

export { H1, H2, H3, H4 }
