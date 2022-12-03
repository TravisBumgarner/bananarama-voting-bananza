import { GraphQLObjectType, } from 'graphql'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { hri } from 'human-readable-ids'

import { EntryType, RoomType } from './types'
import { MessageType } from '../redis/types'

const pubsub = new RedisPubSub({ connection: 'redis' })

const addEntry = {
    type: EntryType,
    description: 'Add an Entry',
    args: {
    },
    resolve: async () => {
        await pubsub.publish(MessageType.Greeting, 'hi')
        return {
            foo: 'foo',
            bar: 'bar'
        }
    },
}

const createRoom = {
    type: RoomType,
    description: 'Create a Room',
    args: {},
    resolve: async () => {
        return {
            id: hri.random()
        }
    },
}

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addEntry,
        createRoom
    }),
})

export default RootMutationType
