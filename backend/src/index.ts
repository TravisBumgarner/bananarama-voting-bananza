import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { useServer } from 'graphql-ws/lib/use/ws'
import cors from 'cors'
import bodyParser from 'body-parser'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import { WebSocketServer } from 'ws'

import { logger } from './utilities'
import errorLookup from './errorLookup'
import schema from './schemas'

const app = express()

process.on('uncaughtException', (error: any) => logger(error))
process.on('unhandledRejection', (error: any) => logger(error))

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

const CORS_DEV = [
    'localhost:3000',
]

const COORS_PROD = [
    'https://bananarama-fe-3qcnyp2pna-ue.a.run.app',
    'bananarama.best'
]

// For Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? COORS_PROD
        : CORS_DEV

}))

app.use(bodyParser.json())

app.get('/ok', async (req: express.Request, res: express.Response) => {
    res.send('pong!')
})

app.use('/graphql', graphqlHTTP(() => ({
    schema,
    graphiql: process.env.NODE_ENV !== 'production',
    customFormatErrorFn: (err) => {
        logger(err.message)
        if (err.message in errorLookup) return errorLookup[err.message]
        return {
            statusCode: 500,
            message: 'Something went wrong'
        }
    }
})))

app.use(Sentry.Handlers.errorHandler())
app.use((err, req: express.Request, res: express.Response) => {
    res.statusCode = 500
})

Sentry.init({
    dsn: 'https://f0f907615c134aff90c1a7d1ea17eb34@o4504279410671616.ingest.sentry.io/4504279411851264',
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
})

const server = app.listen(8080, '0.0.0.0', () => {
    console.log('App listening at http://0.0.0.0:8080') //eslint-disable-line

    const wsServer = new WebSocketServer({ server, path: '/graphql' })
    useServer({ schema }, wsServer)
})
