import { createGlobalStyle, css } from 'styled-components'
import { darken, lighten, transparentize } from 'polished'

const colorFactory = (color: string) => ({
    base: color,
    darkest: darken(0.25, color),
    darken: darken(0.10, color),
    lighten: lighten(0.10, color),
    lightest: lighten(0.25, color),
})

const supergreen = colorFactory('#4c5d43') // should be greenish for positive actions
const green = colorFactory('#88AB75') // should be redish for negative actions
const banana = colorFactory('#e5cc56')
const rotten = colorFactory('#51372b')
const superrotten = colorFactory('#6f6f6f')

const colors = {
    supergreen,
    green,
    banana,
    rotten,
    superrotten,
}

const GlobalStyle = createGlobalStyle`
    html {
        font-size: 16px;
        font-weight: 400;
        background: rgb(255,224,75);
        background: linear-gradient(153deg, ${colors.banana.lighten} 0%, ${colors.banana.lightest} 100%);
        font-family: 'Nunito', sans-serif;
        min-height: 100vh;
    }

    body {
        margin: 0;
    }

    body > div#root {
        display: flex;
        justify-content: center;
    }
`

const section = css`
    border-radius: 0.7em;
    background-color: ${colors.green.base};
    border: 2px solid ${colors.green.darken};
`

const subSection = css`
    border-radius: 0.7em;
    /* background: linear-gradient(153deg, ${colors.banana.base} 0%, ${colors.green.base} 100%); */
    background: ${transparentize(0.2, colors.banana.lighten)};
    border: 2px solid ${colors.rotten.base};
`

const snippets = {
    section,
    subSection
}

export { GlobalStyle, colors, snippets }
