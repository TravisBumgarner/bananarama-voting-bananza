import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql'
import { withFilter } from 'graphql-subscriptions'
import { Action, EPubSubActionType, subscribeEvent } from '../pubsub'
import { MemberSubscription, RoomSubscription, DemoSubscription, VoteSubscription } from './types'

type SubscriptionArgs = {
    roomId: string
}

const member = {
    type: MemberSubscription,
    args: {
        roomId: { type: new GraphQLNonNull(GraphQLString) },
    },
    subscribe: withFilter(
        () => subscribeEvent(EPubSubActionType.MEMBER_UPDATE_ACTION),
        (
            payload: Extract<Action, { type: EPubSubActionType.MEMBER_UPDATE_ACTION }>,
            variables: SubscriptionArgs
        ) => {
            return payload.data.roomId === variables.roomId
        }
    ),
    resolve: (payload) => payload.data
}

const demo = {
    type: DemoSubscription,
    args: {
        roomId: { type: new GraphQLNonNull(GraphQLString) },
    },
    subscribe: withFilter(
        () => subscribeEvent(EPubSubActionType.ADD_DEMO_ACTION),
        (
            payload: Extract<Action, { type: EPubSubActionType.ADD_DEMO_ACTION }>,
            variables: SubscriptionArgs
        ) => payload.data.roomId === variables.roomId
    ),
    resolve: (payload) => payload.data
}

const vote = {
    type: VoteSubscription,
    args: {
        roomId: { type: new GraphQLNonNull(GraphQLString) },
    },
    subscribe: withFilter(
        () => subscribeEvent(EPubSubActionType.ADD_VOTE_ACTION),
        (
            payload: (Extract<Action, { type: EPubSubActionType.ADD_VOTE_ACTION }>),
            variables: SubscriptionArgs
        ) => payload.data.roomId === variables.roomId
    ),
    resolve: (payload) => payload.data
}

const room = {
    type: RoomSubscription,
    args: {
        roomId: { type: new GraphQLNonNull(GraphQLString) },
    },
    subscribe: withFilter(
        () => subscribeEvent(EPubSubActionType.ROOM_UPDATE_ACTION),
        (
            payload: Extract<Action, { type: EPubSubActionType.ROOM_UPDATE_ACTION }>,
            variables: SubscriptionArgs
        ) => payload.data.roomId === variables.roomId
    ),
    resolve: (payload) => payload.data
}

const RootQueryType = new GraphQLObjectType({
    name: 'Subscription',
    description: 'Root Subscription',
    fields: {
        room,
        member,
        vote,
        demo
    },
})

export default RootQueryType
