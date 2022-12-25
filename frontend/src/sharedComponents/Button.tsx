import { transparentize } from 'polished'
import styled from 'styled-components'

import { colors } from 'theme'
import Icon, { IconProps } from './Icon'

type ButtonProps = {
    label?: string
    icon?: IconProps['name']
    variation: | 'banana' | 'rotten'
    disabled?: boolean
    fullWidth?: boolean
    onClick?: () => void
    type: 'submit' | 'button'
}

const StyledButton = styled.button`
    font-size: 1rem;
    border: 2px solid;
    padding: 0.5rem 0;
    background-color: transparent;
    font-weight: 700;
    border-radius: 1rem;
    margin: 1rem 0;
    justify-content: center; 
    display: flex;

    align-items: center;

    &:hover {
    cursor: pointer;
    }

    .label, .material-symbols-outlined {
        margin: 0px 6px;
    }

    ${({ fullWidth }: ButtonProps) => (fullWidth
        ? `
            width: 100%; 
        `
        : '')}

    ${({ variation, disabled }: ButtonProps) => {
        if (disabled) {
            return `
                color: ${colors.superrotten.base};
                border-color: ${colors.superrotten.base};
                background-color: ${colors.superrotten.lightest};

                &:hover {
                    cursor: not-allowed;
                }
            `
        }

        if (variation === 'rotten') {
            return `
                color: ${colors.rotten.lighten};
                border-color: ${colors.rotten.lighten};
                background-color: ${transparentize(0.8, colors.rotten.lightest)};

                &:hover {
                    color: ${colors.rotten.base};
                    border-color: ${colors.rotten.base};
                    background-color: ${colors.rotten.lighten};
                    background-color: transparent;
                }
            `
        } if (variation === 'banana') {
            return `
                color: ${colors.banana.base};
                border-color: ${colors.banana.base};
                background-color: ${transparentize(0.8, colors.banana.lighten)};

                &:hover {
                    background-color: transparent;
                    color: ${colors.banana.darken};
                    border-color: ${colors.banana.darken};
                }
            `
        }
    }}
`

const Button = ({ label, icon, variation, fullWidth, disabled, onClick, type }: ButtonProps) => {
    return (
        <StyledButton type={type} onClick={onClick} icon={icon} variation={variation} disabled={disabled} fullWidth={fullWidth}>
            {label && <span className="label">{label}</span>}
            {icon && <Icon name={icon} color={disabled ? colors.superrotten.base : colors[variation].base} />}
        </StyledButton>
    )
}

export default Button
