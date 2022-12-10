import { render } from 'react-dom'
import Modal from 'react-modal'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

import App from './App'
import { Error } from './pages'

const ROOT = 'root'

Modal.setAppElement(`#${ROOT}`)

Sentry.init({
    dsn: 'https://120fe175b62d46f0aeded72e2cd86cf0@o4504279410671616.ingest.sentry.io/4504279411851265',
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
})

const SentryWrapper = () => (
    <Sentry.ErrorBoundary fallback={<Error />}>
        <App />
    </Sentry.ErrorBoundary>
)

render(<SentryWrapper />, document.getElementById(ROOT))
