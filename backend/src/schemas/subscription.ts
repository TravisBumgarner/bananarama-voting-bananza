import { GraphQLObjectType, GraphQLString } from 'graphql'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { MessageType } from '../redis/types'

const pubsub = new RedisPubSub({ connection: 'redis' })

const RootQueryType = new GraphQLObjectType({
    name: 'Subscription',
    description: 'Root Subscription',
    fields: {
        greetings: {
            type: GraphQLString,
            subscribe: () => pubsub.asyncIterator(MessageType.Greeting),
            resolve: (payload) => {
                return 'nasdjlasd'
            }
        }
    },
})

export default RootQueryType
