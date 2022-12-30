import { PubSub } from 'graphql-subscriptions'

enum EPubSubActionType {
    ROOM_UPDATE_ACTION = 'ROOM_UPDATE_ACTION',
    MEMBER_UPDATE_ACTION = 'MEMBER_UPDATE_ACTION',
    ADD_DEMO_ACTION = 'ADD_DEMO_ACTION',
    ADD_VOTE_ACTION = 'ADD_VOTE_ACTION',
}

type RoomSubscriptionAction = {
    type: EPubSubActionType.ROOM_UPDATE_ACTION
    data: {
        roomId: string,
        status?: string,
        maxVotes?: number
    }
}

type MemberSubscriptionAction = {
    type: EPubSubActionType.MEMBER_UPDATE_ACTION,
    data: {
        roomId: string
        userId: string
        userName: string
        status: string
    }
}

type DemoSubscriptionAction = {
    type: EPubSubActionType.ADD_DEMO_ACTION
    data: {
        id: string,
        presenter: string
        demo: string
        roomId: string
    }
}

type VoteSubscriptionAction = {
    type: EPubSubActionType.ADD_VOTE_ACTION,
    data: {
        id: string,
        userId: string,
        demoId: string
        roomId: string
    }
}

type Action =
    | RoomSubscriptionAction
    | MemberSubscriptionAction
    | DemoSubscriptionAction
    | VoteSubscriptionAction

const pubsub = new PubSub()

const publishEvent = (action: Action) => pubsub.publish(action.type, action)
const subscribeEvent = (actionType: EPubSubActionType) => pubsub.asyncIterator(actionType)

export { EPubSubActionType, publishEvent, subscribeEvent, Action }
