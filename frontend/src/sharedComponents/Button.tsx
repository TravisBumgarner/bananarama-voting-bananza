import styled from 'styled-components'

import { colors } from 'theme'

type ButtonProps = {
    variation: 'pear' | 'banana' | 'marble'
    disabled?: boolean
    fullWidth?: boolean
    alignRight?: boolean

}

const Button = styled.button`
    font-size: 1rem;
    border: 4px solid;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;
    border-radius: 1rem;
    margin: 1rem 0;

    display: flex;
    align-items: center;
    > span {
        margin-left: 8px;
    }

    &:hover {
    cursor: pointer;
    }

    ${({ fullWidth }: ButtonProps) => (fullWidth
        ? `
            width: 100%; 
            justify-content: center; 
            display: flex;
        `
        : '')}

    ${({ variation, disabled }: ButtonProps) => {
        if (disabled) {
            return `
                color: ${colors.marble.base};
                border-color: ${colors.marble.base};

                &:hover {
                    cursor: not-allowed;
                }
            `
        }

        if (variation === 'pear') {
            return `
                color: ${colors.pear.base};
                border-color: ${colors.pear.base};

                &:hover {
                    color: ${colors.pear.darken};
                    border-color: ${colors.pear.darken};
                    background-color: ${colors.pear.lightest};
                }
            `
        } if (variation === 'banana') {
            return `
                color: ${colors.banana.base};
                border-color: ${colors.banana.base};

                &:hover {
                    background-color: ${colors.banana.lighten};
                    color: ${colors.banana.darken};
                    border-color: ${colors.banana.darken};
                }
            `
        }
    }}
`

export default Button
