import styled from 'styled-components'

import { colors } from 'theme'

type ParagraphProps = {
    color?: string
    align?: 'center' | 'left'
}

const Paragraph = styled.p<ParagraphProps>`
    ${({ color, align }) => `
        color: ${color || colors.rotten.base};
        text-align: ${align || 'left'};
    `}
    line-height: 1.5;
    margin: 1rem 0;
    font-size: 1rem;
    font-weight: 900;
`

export default Paragraph
