import { useCallback, useContext, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, NormalizedCacheObject, useQuery, gql } from '@apollo/client'

import { GlobalStyle } from 'theme'
import { Loading } from 'sharedComponents'
import { context, Context } from 'context'
import { Header, AlertMessage, Router } from './components'

const GET_ENTRIES = gql`
    query entry {
        entry {
            foo,
            bar
        }
    }    
`

const App = () => {
    const { state } = useContext(context)

    const onGetEntryCompleted = useCallback((data) => {
        console.log('success', data)
    }, [])
    const onGetEntryFailed = useCallback(() => {
        console.log('fail')
    }, [])
    useQuery(GET_ENTRIES, {
        onCompleted: onGetEntryCompleted,
        onError: onGetEntryFailed,
        fetchPolicy: 'network-only'
    })

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

    useEffect(() => {
        const getClient = async () => {
            const httpLink = createHttpLink({
                uri: `${__API_ENDPOINT__}/graphql`,
            })

            const newClient = new ApolloClient({
                cache: new InMemoryCache(),
                link: httpLink,
            })
            setClient(newClient)
            setIsLoading(false)
        }

        getClient()
    }, [])
    console.log(isLoading)
    if (isLoading) {
        console.log('um')
        return <Loading />
    }

    return (
        <ApolloProvider client={client!}>
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
