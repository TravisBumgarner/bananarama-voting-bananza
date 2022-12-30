import * as Sentry from '@sentry/node'

type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>
type Exactly<T, K extends keyof T> = Pick<T, K>

const logger = (message: any) => {
    if (process.env.NODE_ENV !== 'local') {
        Sentry.captureException(JSON.stringify(message))
    }
    console.log(JSON.stringify(message)) // eslint-disable-line
}

const generateID = (length: number) => {
    let result = ''
    const characters = 'abcdefghjkmnopqrstuvwyxz'
    const charactersLength = characters.length
    for (let i = 0; i < length; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

export {
    AtLeast,
    Exactly,
    logger,
    generateID
}
