import { createGlobalStyle } from 'styled-components'
import { darken, lighten } from 'polished'

const colorFactory = (color: string) => ({
    base: color,
    darkest: darken(0.25, color),
    darken: darken(0.10, color),
    lighten: lighten(0.1, color),
    lightest: lighten(0.25, color),
})

const PRIMARY = colorFactory('#282828')
const BACKGROUND = colorFactory('#f2f8da')
const WARNING = colorFactory('#9c183a')
const HIGHLIGHTER = colorFactory('#e8e5ba')

const colors = {
    PRIMARY,
    BACKGROUND,
    WARNING,
    HIGHLIGHTER
}

const GlobalStyle = createGlobalStyle`
    html {
        font-size: 16px;
        font-weight: 400;
        background-color: ${colors.BACKGROUND.base};
        font-family: 'Nunito', sans-serif;
    }

    body {
        margin: 0;
    }
`

export { GlobalStyle, colors }
