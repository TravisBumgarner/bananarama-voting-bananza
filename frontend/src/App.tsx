import { useCallback, useContext } from 'react'
import { BrowserRouter } from 'react-router-dom'
import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
    useSubscription,
    useMutation,
    split
} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'

import { GlobalStyle } from 'theme'
import { context, Context } from 'context'
import { Header, AlertMessage, Router } from './components'

const wsLink = new GraphQLWsLink(createClient({ url: 'ws://localhost:4000/graphql', }))
const httpLink = new HttpLink({ uri: 'http://localhost:8080/graphql' })

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query)
        return (
            definition.kind === 'OperationDefinition'
            && definition.operation === 'subscription'
        )
    },
    wsLink,
    httpLink,
)

const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink
})

const GET_ENTRIES = gql`
    query entry {
        entry {
            foo,
            bar
        }
    }    
`

const ENTRY_MUTATION = gql`
    mutation EntryMutation {
        addEntry {
            foo,
            bar
        }
    }    
`

const GREETING_SUBSCRIPTION = gql`
  subscription Greeting {
    greetings
  }
`

const App = () => {
    const { state } = useContext(context)

    const [addEntryMutation] = useMutation(ENTRY_MUTATION)

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

    useSubscription(GREETING_SUBSCRIPTION, {
        onData: (data) => {
            console.log('subscription', data)
        },
    })

    const mutate = async () => {
        const response = await addEntryMutation()
        console.log(response.data)
    }

    return (
        <>
            {state.message ? <AlertMessage /> : null}
            <Header />
            <Router />
            <button type="button" onClick={mutate}>Mutate</button>
        </>
    )
}

// const GraphQLWrapper = () => {
//     const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null)
//     // const [isLoading, setIsLoading] = useState<boolean>(true)

//     // useEffect(() => {
//     //     const getClient = async () => {
//     //         const httpLink = createHttpLink({
//     //             uri: `${__API_ENDPOINT__}/graphql`,
//     //         })

//     //         const newClient = new ApolloClient({
//     //             cache: new InMemoryCache(),
//     //             link: httpLink,
//     //         })
//     //         setClient(newClient)
//     //         setIsLoading(false)
//     //     }

//     //     getClient()
//     // }, [])
//     console.log(isLoading)
//     if (isLoading) {
//         console.log('um')
//         return <Loading />
//     }

//     return (
//         <ApolloProvider client={client!}>
//             <App />
//         </ApolloProvider>
//     )
// }

const ContextWrapper = () => (
    <BrowserRouter>
        <ApolloProvider client={apolloClient}>
            <Context>
                <>
                    <GlobalStyle />
                    <App />
                </>
            </Context>
        </ApolloProvider>
    </BrowserRouter>
)

export default ContextWrapper
