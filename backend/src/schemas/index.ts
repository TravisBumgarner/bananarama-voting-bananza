import {
    GraphQLSchema,
} from 'graphql'

import RootMutationType from './mutations'
import RootQueryType from './queries'
import RootSubscriptionType from './subscription'

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
    subscription: RootSubscriptionType,
})

export default schema
