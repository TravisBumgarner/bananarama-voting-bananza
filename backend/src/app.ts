import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { useServer } from 'graphql-ws/lib/use/ws'
import cors from 'cors'
import bodyParser from 'body-parser'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import { WebSocketServer } from 'ws' // yarn add ws

import errorLookup from './errorLookup'
import schema from './schemas'

const app = express()

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

// For Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})
app.use(cors({
    origin: [
        'localhost:3000'
    ]
}))

app.use(bodyParser.json())

app.get('/ok', async (req: express.Request, res: express.Response) => {
    res.send('pong!')
})

app.use('/graphql', graphqlHTTP(() => ({
    schema,
    graphiql: process.env.NODE_ENV !== 'production',
    customFormatErrorFn: (err) => {
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
    dsn: 'https://c381a2e3d0dc403b9ed5fa31ee701265@o196886.ingest.sentry.io/4504143134785536',
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
})

const startup = async () => {
    await app.listen(8080, '0.0.0.0', () => {
        console.log('App listening at http://0.0.0.0:8080') //eslint-disable-line
    })

    const server = app.listen(4000, () => {
        console.log('starting on 4000')
    })
    const wsServer = new WebSocketServer({
        server,
        path: '/graphql',
    })
    useServer({ schema }, wsServer)
}

export default startup
