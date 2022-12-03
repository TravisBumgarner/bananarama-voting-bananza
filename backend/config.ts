import { String, Record, Number } from 'runtypes'

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const Env = Record({
    postgres: Record({
        host: String,
        port: Number,
        username: String,
        password: String,
        database: String,
    })
})

const getEnv = () => {
    const env = {
        postgres: {
            host: process.env.POSTGRES_HOST, // This needs to match the Docker name for local dev.
            port: parseInt(process.env.POSTGRES_PORT || '', 10),
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
        }
    }
    try {
        return Env.check(env)
    } catch (error) {
        throw Error(`Invalid project config, ${JSON.stringify(env)}`)
    }
}

const config = getEnv()

export default config
