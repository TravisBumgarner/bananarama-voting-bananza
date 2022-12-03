import { GraphQLObjectType, } from 'graphql'
import { RedisPubSub } from 'graphql-redis-subscriptions'

import { EntryType } from './types'

const pubsub = new RedisPubSub({ connection: 'redis' })

const addEntry = {
    type: EntryType,
    description: 'Add an Entry',
    args: {
    },
    resolve: async () => {
        await pubsub.publish('GREETING', 'hi')
        return {
            foo: 'foo',
            bar: 'bar'
        }
    },
}

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addEntry
    }),
})

export default RootMutationType
