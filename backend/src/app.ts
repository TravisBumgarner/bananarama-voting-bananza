import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import cors from 'cors'
import bodyParser from 'body-parser'
import * as Sentry from '@sentry/node'

type ModifiedExpressRequest = express.Request & { firebaseId: string }

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
        'https://placeaday-fd46a.web.app/'
    ]
}))

app.use(bodyParser.json())

app.get('/ok', async (req: ModifiedExpressRequest, res: express.Response) => {
    res.send('pong!')
})

// app.use('/graphql', graphqlHTTP((req: ModifiedExpressRequest) => ({
//     schema,
//     graphiql: process.env.NODE_ENV !== 'production',
//     context: { firebaseId: req.firebaseId },
// })))

app.use(Sentry.Handlers.errorHandler())
app.use((err, req: ModifiedExpressRequest, res: express.Response) => {
    res.statusCode = 500
})

export default app
