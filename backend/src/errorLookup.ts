import { EErrorMessages } from './types'

const errorLookup: Record<EErrorMessages, { message: string, statusCode: number }> = {
    [EErrorMessages.MemberAlreadyExists]: {
        message: 'That member already exists in the selected room',
        statusCode: 403
    },
    [EErrorMessages.RoomDoesNotExist]: {
        message: 'That room does not exist',
        statusCode: 403
    }
}

export default errorLookup