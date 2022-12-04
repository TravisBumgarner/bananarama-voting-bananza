import { createGlobalStyle } from 'styled-components'
import { darken, lighten } from 'polished'

const colorFactory = (color: string) => ({
    base: color,
    darkest: darken(0.25, color),
    darken: darken(0.10, color),
    lighten: lighten(0.10, color),
    lightest: lighten(0.25, color),
})

const BRIGHT1 = colorFactory('#88AB75') // should be greenish for positive actions
const BRIGHT2 = colorFactory('#DE8F6E') // should be redish for negative actions
const BRIGHT3 = colorFactory('#DBD56E')
const BRIGHT4 = colorFactory('#2D93AD')
const BRIGHT5 = colorFactory('#a8afb1')
const DISABLED = colorFactory('#3F3F44')

const DARK1 = colorFactory('#282828')

const colors = {
    BRIGHT1,
    BRIGHT2,
    BRIGHT3,
    BRIGHT4,
    BRIGHT5,
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
