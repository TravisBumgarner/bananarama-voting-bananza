import { PubSub } from 'graphql-subscriptions'

enum EPubSubMessage {
    ROOM_UPDATE_EVENT = 'ROOM_UPDATE_EVENT',
    MEMBER_CHANGE_EVENT = 'MEMBER_CHANGE_EVENT',
    ADD_ENTRY = 'ADD_ENTRY',
    ADD_VOTE = 'ADD_VOTE',
}

const pubsub = new PubSub()

export default pubsub
export { EPubSubMessage }