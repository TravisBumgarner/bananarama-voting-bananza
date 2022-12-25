import { createGlobalStyle, css } from 'styled-components'
import { darken, lighten } from 'polished'

const colorFactory = (color: string) => ({
    base: color,
    darkest: darken(0.25, color),
    darken: darken(0.10, color),
    lighten: lighten(0.10, color),
    lightest: lighten(0.25, color),
})

const pear = colorFactory('#4c5d43') // should be greenish for positive actions
const apple = colorFactory('#88AB75') // should be redish for negative actions
const banana = colorFactory('#e5cc56')
const blueberry = colorFactory('#51372b')
const disabled = colorFactory('#262626')
const marble = colorFactory('#a8afb1')

/*
const pear = colorFactory('#3dad00') // should be greenish for positive actions
const apple = colorFactory('#d74405') // should be redish for negative actions
const banana = colorFactory('#dcd103')
const blueberry = colorFactory('#0080a0')
const marble = colorFactory('#a8afb1')
*/

const coffee = colorFactory('#282828')

const colors = {
    pear,
    apple,
    banana,
    blueberry,
    marble,
    disabled,
    coffee,
}

const GlobalStyle = createGlobalStyle`
    html {
        font-size: 16px;
        font-weight: 400;
        background: rgb(255,224,75);
        background: linear-gradient(153deg, ${colors.banana.lightest} 0%, ${colors.banana.lighten} 100%);
        font-family: 'Nunito', sans-serif;
        min-height: 100vh;
    }

    body {
        margin: 0;
    }

    body > div#root {
        display: flex;
        justify-content: center;
        width: 100vw;
    }
`

const section = css`
    border-radius: 1rem;
    background-color: ${colors.banana.lighten};
`

const subSection = css`
    border-radius: 1rem;
    background: ${colors.banana.lightest};
`

const snippets = {
    section,
    subSection
}

export { GlobalStyle, colors, snippets }
