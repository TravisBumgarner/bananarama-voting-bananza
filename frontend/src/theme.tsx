import { createGlobalStyle } from 'styled-components'
import { darken, lighten } from 'polished'

const colorFactory = (color: string) => ({
    base: color,
    darkest: darken(0.25, color),
    darken: darken(0.10, color),
    lighten: lighten(0.10, color),
    lightest: lighten(0.25, color),
})

const BRIGHT1 = colorFactory('#35ff1a') // should be greenish for positive actions
const BRIGHT2 = colorFactory('#ff1e1e') // should be redish for negative actions
const BRIGHT3 = colorFactory('#d9ff00')
const BRIGHT4 = colorFactory('#00fbff')
const DISABLED = colorFactory('#808080')

const DARK1 = colorFactory('#282828')

const colors = {
    BRIGHT1,
    BRIGHT2,
    BRIGHT3,
    BRIGHT4,
    DARK1,
    DISABLED
}

const GlobalStyle = createGlobalStyle`
    html {
        font-size: 16px;
        font-weight: 400;
        background-color: ${colors.DARK1.base};
        font-family: 'Nunito', sans-serif;
    }

    body {
        margin: 0;
    }
`

export { GlobalStyle, colors }
