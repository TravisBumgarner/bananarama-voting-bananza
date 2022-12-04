import { GraphQLObjectType } from 'graphql'
import { RedisPubSub } from 'graphql-redis-subscriptions'

import { MemberChangeType } from './types'

const pubsub = new RedisPubSub({ connection: 'redis' })

const memberChange = {
    type: MemberChangeType,
    subscribe: () => pubsub.asyncIterator('MEMBER_CHANGE_EVENT'),
    resolve: (payload) => {
        return payload
    }
}

const RootQueryType = new GraphQLObjectType({
    name: 'Subscription',
    description: 'Root Subscription',
    fields: {
        memberChange
    },
})

export default RootQueryType
