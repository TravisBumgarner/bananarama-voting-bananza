import * as ReactDOM from 'react-dom'
import Modal from 'react-modal'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

import App from './App'
import { Error } from './pages'

const ROOT = 'root'

Modal.setAppElement(`#${ROOT}`)

Sentry.init({
    dsn: 'https://3259730bff4e4c5fb5b37820c4c4a697@o196886.ingest.sentry.io/6238284',
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

ReactDOM.render(<SentryWrapper />, document.getElementById(ROOT))
