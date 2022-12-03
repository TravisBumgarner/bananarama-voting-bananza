type CheckboxProps = {
    label: string
    checked: boolean
    toggleChecked: () => void
}

const Checkbox = ({ label, checked, toggleChecked }: CheckboxProps) => {
    return (
        <div>
            <label htmlFor={label}>{label}</label>
            <input
                id={label}
                type="checkbox"
                checked={checked}
                onChange={toggleChecked}
            />
        </div>
    )
}

export default Checkbox
