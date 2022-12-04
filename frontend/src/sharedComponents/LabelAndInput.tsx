import styled from 'styled-components'

import { colors } from 'theme'

const Input = styled.input`
    font-size: 1rem;
    border: 2px solid;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${colors.PRIMARY.base};
    border-color: ${colors.PRIMARY.base};
    width: 100%;
    box-sizing: border-box;
    border-radius: 1rem;
`

const LabelAndInputWrapper = styled.div`
    margin: 0.5rem 0;
    ${Input}{
        display: block;
        width: 100%;
        box-sizing: border-box;
    }
`

type LabelAndInputProps = {
    name: string
    label?: string
    value: string
    handleChange: (value: string) => void
    disabled?: boolean
}

const LabelAndInput = ({
    value, name, label, handleChange, disabled
}: LabelAndInputProps) => (
    <LabelAndInputWrapper>
        <Input
            placeholder={label}
            autoComplete="on"
            name={name}
            onChange={(event) => handleChange(event.target.value)}
            value={value}
            disabled={disabled}
        />
    </LabelAndInputWrapper>
)

export default LabelAndInput
