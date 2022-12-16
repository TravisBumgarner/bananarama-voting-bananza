import { FormEvent, useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Button, Icon, Input } from 'sharedComponents'
import { context } from 'context'
import { getLocalStorage, setLocalStorage } from 'utilities'
import { colors } from 'theme'

type JoinModalProps = {
    closeModal: () => void
}

const JoinModal = ({ closeModal }: JoinModalProps) => {
    const [name, setName] = useState<string>(getLocalStorage('user').name || '')
    const { dispatch } = useContext(context)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        let id: string
        if (name === getLocalStorage('user').name) {
            // If the user hasn't changed their name, grab the ID from storage.
            // Otherwise, generate a new one.
            id = getLocalStorage('user').id
        } else {
            id = uuidv4()
        }
        setIsLoading(true)
        setLocalStorage('user', { name, id })
        dispatch({ type: 'JOIN', data: { name, id } })
        closeModal()
    }

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <Input
                        label="What is your name?"
                        name="Name"
                        value={name}
                        handleChange={(data) => setName(data)}
                    />

                    <Button
                        disabled={name.length === 0 || isLoading}
                        fullWidth
                        key="submit"
                        type="submit"
                        variation="pear"
                    >Let the Voting Commence! <Icon color={name.length === 0 ? colors.marble.base : colors.pear.base} name="rocket_launch" />
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default JoinModal
