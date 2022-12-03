import { useContext, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, NormalizedCacheObject } from '@apollo/client'

import { GlobalStyle } from 'theme'
import { Loading } from 'sharedComponents'
import { context, Context } from 'context'
import { Header, AlertMessage, Router } from './components'

const App = () => {
    const { state } = useContext(context)

    return (
        <>
            {state.message ? <AlertMessage /> : null}
            <Header />
            <Router />
        </>
    )
}

const GraphQLWrapper = () => {
    const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { state } = useContext(context)

    useEffect(() => {
        const getUnauthedClient = async () => {
            const httpLink = createHttpLink({
                uri: `${__API_ENDPOINT__}/graphql`,
            })

            const unauthedClient = new ApolloClient({
                cache: new InMemoryCache(),
                link: httpLink,
            })
            setClient(unauthedClient)
            setIsLoading(false)
        }

        getUnauthedClient()
    }, [state.currentUser])

    if (isLoading) {
        return <Loading />
    }

    if (!client) {
        return <p>Hmm you are not logged in.</p>
    }

    return (
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    )
}

const ContextWrapper = () => (
    <BrowserRouter>
        <Context>
            <>
                <GlobalStyle />
                <GraphQLWrapper />
            </>
        </Context>
    </BrowserRouter>
)

export default ContextWrapper
