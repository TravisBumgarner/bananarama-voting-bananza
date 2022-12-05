import { createGlobalStyle } from 'styled-components'
import { darken, lighten } from 'polished'

const colorFactory = (color: string) => ({
    base: color,
    darkest: darken(0.25, color),
    darken: darken(0.10, color),
    lighten: lighten(0.10, color),
    lightest: lighten(0.25, color),
})

const pear = colorFactory('#88AB75') // should be greenish for positive actions
const apple = colorFactory('#DE8F6E') // should be redish for negative actions
const banana = colorFactory('#DBD56E')
const blueberry = colorFactory('#2D93AD')
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
    coffee,
}

const GlobalStyle = createGlobalStyle`
    html {
        font-size: 16px;
        font-weight: 400;
        background-color: ${colors.coffee.base};
        font-family: 'Nunito', sans-serif;
    }

    body {
        margin: 0;
    }
`

export { GlobalStyle, colors }
