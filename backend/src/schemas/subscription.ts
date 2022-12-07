import { GraphQLObjectType } from 'graphql'
import pubsub, { EPubSubMessage } from '../pubsub'

import { MemberChangeType, RoomUpdateType, AddEntryType, AddVoteType } from './types'

const memberChange = {
    type: MemberChangeType,
    subscribe: () => pubsub.asyncIterator(EPubSubMessage.MEMBER_CHANGE_EVENT),
    resolve: (payload) => {
        return payload
    }
}

const addEntry = {
    type: AddEntryType,
    subscribe: () => pubsub.asyncIterator(EPubSubMessage.ADD_ENTRY),
    resolve: (payload) => {
        return payload
    }
}

const addVote = {
    type: AddVoteType,
    subscribe: () => pubsub.asyncIterator(EPubSubMessage.ADD_VOTE),
    resolve: (payload) => {
        return payload
    }
}

const roomUpdate = {
    type: RoomUpdateType,
    subscribe: () => pubsub.asyncIterator(EPubSubMessage.ROOM_UPDATE_EVENT),
    resolve: (payload) => {
        return payload
    }
}

const RootQueryType = new GraphQLObjectType({
    name: 'Subscription',
    description: 'Root Subscription',
    fields: {
        memberChange,
        roomUpdate,
        addEntry,
        addVote
    },
})

export default RootQueryType
