import { ExternalLink, Heading, Paragraph } from 'sharedComponents'

const LandingPage = () => (
    <div>
        <Heading.H2>Alpha</Heading.H2>
        <Paragraph>This application is currently in alpha. <ExternalLink target="_blank" href={__FEEDBACK_FORM_URL__}>Please leave feedback!</ExternalLink>  {/* eslint-disable-line */}</Paragraph>
    </div>
)

export default LandingPage
