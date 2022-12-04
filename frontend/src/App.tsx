import { useContext, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import styled from 'styled-components'
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'

import { GlobalStyle } from 'theme'
import { context, Context } from 'context'
import { AlertMessage, Router } from './components'
import { JoinModal } from './modals'
import Modal from './sharedComponents/Modal'

const AppWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
`

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

const App = () => {
    const { state } = useContext(context)
    const [showJoinModal, setShowJoinModal] = useState<boolean>(true)
    console.log('state', state)
    return (
        <>
            <AppWrapper>
                {state.message ? <AlertMessage /> : null}
                <Router />
            </AppWrapper>
            <Modal
                showModal={showJoinModal}
                closeModal={() => setShowJoinModal(false)}
                contentLabel="Identify Yourself!"
            >
                <JoinModal closeModal={() => setShowJoinModal(false)} />
            </Modal>
        </>
    )
}

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
