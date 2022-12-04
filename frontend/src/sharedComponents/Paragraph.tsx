import styled from 'styled-components'

import { colors } from 'theme'

type ParagraphProps = {
    color?: string
}

const Paragraph = styled.p`
    ${({ color }: ParagraphProps) => `color: ${color || colors.banana.base};`}
    line-height: 1.5
`

export default Paragraph
