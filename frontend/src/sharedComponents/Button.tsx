import styled from 'styled-components'

import { colors } from 'theme'
import Icon, { IconProps } from './Icon'

type ButtonProps = {
    label?: string
    icon?: IconProps['name']
    variation: | 'banana' | 'apple'
    disabled?: boolean
    fullWidth?: boolean
    onClick?: () => void
    type: 'submit' | 'button'
}

const StyledButton = styled.button`
    font-size: 1rem;
    border: 4px solid;
    padding: 0.5rem 1rem;
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
                color: ${colors.disabled.base};
                border-color: ${colors.disabled.base};

                &:hover {
                    cursor: not-allowed;
                }
            `
        }

        if (variation === 'apple') {
            return `
                color: ${colors.apple.base};
                border-color: ${colors.apple.base};

                &:hover {
                    color: ${colors.apple.darken};
                    border-color: ${colors.apple.darken};
                    background-color: ${colors.apple.lightest};
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

const Button = ({ label, icon, variation, fullWidth, disabled, onClick, type }: ButtonProps) => {
    return (
        <StyledButton type={type} onClick={onClick} icon={icon} variation={variation} disabled={disabled} fullWidth={fullWidth}>
            {label && <span className="label">{label}</span>}
            {icon && <Icon name={icon} color={disabled ? colors.marble.base : colors[variation].base} />}
        </StyledButton>
    )
}

export default Button
