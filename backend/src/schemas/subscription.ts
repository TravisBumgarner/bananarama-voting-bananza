import { GraphQLObjectType, GraphQLString } from 'graphql'
import { RedisPubSub } from 'graphql-redis-subscriptions'

const pubsub = new RedisPubSub({ connection: 'redis' })

const RootQueryType = new GraphQLObjectType({
    name: 'Subscription',
    description: 'Root Subscription',
    fields: {
        greetings: {
            type: GraphQLString,
            subscribe: () => pubsub.asyncIterator('GREETING'),
            resolve: (payload) => {
                return 'nasdjlasd'
            }
        }
    },
})

export default RootQueryType
