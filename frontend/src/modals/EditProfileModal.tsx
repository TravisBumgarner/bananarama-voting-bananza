import { useContext, useState } from 'react'
import { updateEmail, updatePassword } from 'firebase/auth'

import { LabelAndInput, Button, Heading, ButtonWrapper } from 'sharedComponents'
import { context } from 'context'

type EditProfileProps = {
    closeModal: () => void
}

const EditProfileModal = ({ closeModal }: EditProfileProps) => {
    const { dispatch, state } = useContext(context)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [email, setEmail] = useState<string>(state!.currentUser!.email!)
    const [password, setPassword] = useState<string>('')
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('')

    const handleSubmit = async () => {
        setIsLoading(true)

        if (password !== passwordConfirmation) {
            dispatch({ type: 'ADD_MESSAGE', data: { message: 'Passwords don\'t match' } })
            setIsLoading(false)
            return
        }

        try {
            if (email !== state.currentUser!.email) {
                await updateEmail(state.currentUser!, email)
            }
            if (password.length > 0) {
                await updatePassword(state.currentUser!, password)
            }
            closeModal()
        } catch (error) {
            dispatch({
                type: 'ADD_MESSAGE',
                data: {
                    message: `Failed to update user: ${error.message}`,
                },
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <div>
                <LabelAndInput label="Email" value={email} name="email" handleChange={(data) => setEmail(data)} />
            </div>

            <div>
                <LabelAndInput label="Password" value={password} name="password" handleChange={(data) => setPassword(data)} />
            </div>

            <div>
                <LabelAndInput
                    label="Confirm Password"
                    value={password}
                    name="confirmPassword"
                    handleChange={(data) => setPasswordConfirmation(data)}
                />

            </div>

            <ButtonWrapper
                right={[
                    <Button key="close" variation="warning" disabled={isLoading} onClick={closeModal}>Cancel</Button>,
                    <Button key="save" variation="primary" disabled={isLoading} onClick={handleSubmit}>Save</Button>
                ]}
            />
        </div>
    )
}

export default EditProfileModal
