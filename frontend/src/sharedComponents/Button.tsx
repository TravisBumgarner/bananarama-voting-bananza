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
    border: 2px solid;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;
    border-radius: 1rem;
    margin: 0.5rem 0;,

    &:hover {
    cursor: pointer;
    }

    ${({ fullWidth }: ButtonProps) => (fullWidth ? 'width: 100%;' : '')}

    ${({ variation, disabled }: ButtonProps) => {
        if (disabled) {
            return `
                color: ${colors.PRIMARY.base};
                border-color: ${colors.PRIMARY.base};

                &:hover {
                    background-color: ${colors.PRIMARY.lighten};
                    color: ${colors.PRIMARY.darken};
                    border-color: ${colors.PRIMARY.darken};
                    cursor: not-allowed;
                }
            `
        }

        if (variation === 'primary') {
            return `
                color: ${colors.PRIMARY.base};
                border-color: ${colors.PRIMARY.base};

                &:hover {
                    color: ${colors.PRIMARY.darken};
                    border-color: ${colors.PRIMARY.darken};
                    background-color: ${colors.PRIMARY.lighten};
                }
            `
        } if (variation === 'warning') {
            return `
                color: ${colors.WARNING.base};
                border-color: ${colors.WARNING.base};

                &:hover {
                    background-color: ${colors.WARNING.lighten};
                    color: ${colors.WARNING.darken};
                    border-color: ${colors.WARNING.darken};
                }
            `
        }
    }}
`

export default Button
