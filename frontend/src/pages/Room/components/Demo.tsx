import styled from 'styled-components'

import { Heading, Paragraph } from 'sharedComponents'
import { snippets } from 'theme'
import { TDemo } from 'types'

const DemoWrapper = styled.li`
${snippets.subSection};
border-radius: 0.7em;
margin: 0 0 1rem 0;
padding: 1rem;
box-sizing: border-box;

&:last-child{
    margin-bottom: 0;
}
`

const Demo = ({ demo }: { demo: TDemo }) => {
    return (
        <DemoWrapper>
            <Heading.H3>{demo.demo}</Heading.H3>
            <Paragraph>{demo.presenter}</Paragraph>
        </DemoWrapper>
    )
}

export default Demo
