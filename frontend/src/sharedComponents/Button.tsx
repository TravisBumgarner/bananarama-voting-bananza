import styled from 'styled-components'

import { colors } from 'theme'

type ButtonProps = {
    variation: 'primary' | 'warning' | 'marble'
    marble?: boolean
    fullWidth?: boolean
    alignRight?: boolean

}

const Button = styled.button`
    text-transform: uppercase;
    font-size: 1rem;
    border: 4px solid;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;
    border-radius: 1rem;
    margin: 0.5rem 0;

    &:hover {
    cursor: pointer;
    }

    ${({ fullWidth }: ButtonProps) => (fullWidth ? 'width: 100%;' : '')}

    ${({ variation, marble }: ButtonProps) => {
        if (marble) {
            return `
                color: ${colors.marble.base};
                border-color: ${colors.marble.base};

                &:hover {
                    cursor: not-allowed;
                }
            `
        }

        if (variation === 'primary') {
            return `
                color: ${colors.pear.base};
                border-color: ${colors.pear.base};

                &:hover {
                    color: ${colors.pear.darken};
                    border-color: ${colors.pear.darken};
                    background-color: ${colors.pear.lightest};
                }
            `
        } if (variation === 'warning') {
            return `
                color: ${colors.apple.base};
                border-color: ${colors.apple.base};

                &:hover {
                    background-color: ${colors.apple.lighten};
                    color: ${colors.apple.darken};
                    border-color: ${colors.apple.darken};
                }
            `
        }
    }}
`

export default Button
