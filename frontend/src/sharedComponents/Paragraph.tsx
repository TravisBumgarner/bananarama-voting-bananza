import styled from 'styled-components'

import { colors } from 'theme'

type ParagraphProps = {
    color?: string
}

const Paragraph = styled.p`
    ${({ color }: ParagraphProps) => `color: ${color || colors.rotten.base};`}
    line-height: 1.5;
    margin: 0;
    font-size: 1rem;
    font-weight: 900;
`

export default Paragraph
