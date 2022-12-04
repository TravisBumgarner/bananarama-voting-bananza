import { GraphQLObjectType } from 'graphql'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { MessageType } from '../redis/types'

import { MemberChangeType, RoomUpdateType } from './types'

const pubsub = new RedisPubSub({ connection: 'redis' })

const memberChange = {
    type: MemberChangeType,
    subscribe: () => pubsub.asyncIterator(MessageType.MEMBER_CHANGE_EVENT),
    resolve: (payload) => {
        console.log('payload', payload)
        return payload
    }
}

const roomUpdate = {
    type: RoomUpdateType,
    subscribe: () => pubsub.asyncIterator(MessageType.ROOM_UPDATE_EVENT),
    resolve: (payload) => {
        console.log('payload', payload)
        return payload
    }
}

const RootQueryType = new GraphQLObjectType({
    name: 'Subscription',
    description: 'Root Subscription',
    fields: {
        memberChange,
        roomUpdate
    },
})

export default RootQueryType
