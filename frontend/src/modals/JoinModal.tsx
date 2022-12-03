import { FormEvent, useContext, useState } from 'react'

import { Button, LabelAndInput } from 'sharedComponents'
import { context } from 'context'
import { getLocalStorage, setLocalStorage } from 'utilities'

type JoinModalProps = {
    closeModal: () => void
}

const JoinModal = ({ closeModal }: JoinModalProps) => {
    const [name, setName] = useState<string>(getLocalStorage('name'))
    const { dispatch } = useContext(context)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setLocalStorage('name', name)
        dispatch({ type: 'JOIN', data: { name } })
        closeModal()
    }

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <LabelAndInput
                        label="What is your name?"
                        name="Name"
                        value={name}
                        handleChange={(data) => setName(data)}
                    />

                    <Button fullWidth key="submit" type="submit" variation="primary">Submit</Button>
                </form>
            </div>
        </div>
    )
}

export default JoinModal
