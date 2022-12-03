import * as Sentry from '@sentry/react'

type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>
type Exactly<T, K extends keyof T> = Pick<T, K>

const logger = (message: any) => {
    if (__LOGGING_LEVEL__ === 'sentry') {
        Sentry.captureException(JSON.stringify(message))
    }
    console.log(JSON.stringify(message)) // eslint-disable-line
}

const sanitizeRoomId = (dangerousString: string) => {
    const re = /[^a-z0-9-]/gi
    const cleanString = dangerousString.replace(re, '')
    return cleanString
}

export {
    logger,
    AtLeast,
    Exactly,
    sanitizeRoomId
}
