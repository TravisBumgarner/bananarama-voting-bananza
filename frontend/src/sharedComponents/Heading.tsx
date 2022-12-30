import styled from 'styled-components'

import { colors } from 'theme'

const H1 = styled.h1`
    font-size: 3rem;
    color: ${colors.supergreen.base};
    margin: 1rem 0;
    text-align: center;
    width: 100%;
`

const H2 = styled.h2`
    color: ${colors.supergreen.base};
    margin: 0.5rem 0;
    text-align: center;
`

const H3 = styled.h3`
    color: ${colors.rotten.base};
    margin: 0.25rem 0;
    text-align: left;
    font-size: 1.5rem;
`

export { H1, H2, H3 }
