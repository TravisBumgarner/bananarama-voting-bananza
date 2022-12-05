import styled from 'styled-components'

import { colors } from 'theme'

const Input = styled.input`
    font-size: 1rem;
    border: 4px solid;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${colors.banana.base};
    border-color: ${colors.banana.base};
    width: 100%;
    box-sizing: border-box;
    border-radius: 1rem;
    text-align: center;

    ::placeholder {
        color: ${colors.marble.base};
  }
`

const LabelWrapper = styled.div`
    margin: 0.5rem 0;
    ${Input}{
        display: block;
        width: 100%;
        box-sizing: border-box;
    }
`

type LabelProps = {
    name: string
    label?: string
    value: string
    handleChange: (value: string) => void
    marble?: boolean
}

const Label = ({
    value, name, label, handleChange, marble
}: LabelProps) => (
    <LabelWrapper>
        <Input
            placeholder={label}
            autoComplete="on"
            name={name}
            onChange={(event) => handleChange(event.target.value)}
            value={value}
        />
    </LabelWrapper>
)

export default Label
