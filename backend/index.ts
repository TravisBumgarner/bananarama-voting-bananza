import * as Sentry from '@sentry/node'
import '@sentry/tracing'
import * as Tracing from '@sentry/tracing'

import app from './src/app'

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
}

startup()
