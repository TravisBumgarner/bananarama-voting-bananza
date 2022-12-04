import styled from 'styled-components'

import { colors } from 'theme'

type ButtonProps = {
    variation: 'primary' | 'warning' | 'disabled'
    disabled?: boolean
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

    ${({ variation, disabled }: ButtonProps) => {
        if (disabled) {
            return `
                color: ${colors.DISABLED.base};
                border-color: ${colors.DISABLED.base};

                &:hover {
                    cursor: not-allowed;
                }
            `
        }

        if (variation === 'primary') {
            return `
                color: ${colors.BRIGHT1.base};
                border-color: ${colors.BRIGHT1.base};

                &:hover {
                    color: ${colors.BRIGHT1.darken};
                    border-color: ${colors.BRIGHT1.darken};
                    background-color: ${colors.BRIGHT1.lightest};
                }
            `
        } if (variation === 'warning') {
            return `
                color: ${colors.BRIGHT2.base};
                border-color: ${colors.BRIGHT2.base};

                &:hover {
                    background-color: ${colors.BRIGHT2.lighten};
                    color: ${colors.BRIGHT2.darken};
                    border-color: ${colors.BRIGHT2.darken};
                }
            `
        }
    }}
`

export default Button
