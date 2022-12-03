import { GraphQLNonNull, GraphQLObjectType, GraphQLString, } from 'graphql'
import { RedisPubSub } from 'graphql-redis-subscriptions'

import { EErrorMessages } from '../types'
import inMemoryDatastore from '../inMemoryDatastore'
import { RoomType } from './types'
import { MessageType } from '../redis/types'

const pubsub = new RedisPubSub({ connection: 'redis' })

type CreateRoomArgs = {
    ownerId: string
    ownerName: string
}

const createRoom = {
    type: RoomType,
    description: 'Create a Room',
    args: {
        ownerId: { type: new GraphQLNonNull(GraphQLString) },
        ownerName: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args: CreateRoomArgs) => {
        const id = inMemoryDatastore.createRoom({ id: args.ownerId, name: args.ownerName })
        console.log(inMemoryDatastore.getRoom(id))
        return {
            id,
        }
    },
}

type JoinRoomArgs = {
    roomId: string
    memberId: string
    memberName: string
}

const joinRoom = {
    type: RoomType,
    description: 'Join a Room',
    args: {
        roomId: { type: new GraphQLNonNull(GraphQLString) },
        memberId: { type: new GraphQLNonNull(GraphQLString) },
        memberName: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args: JoinRoomArgs) => {
        const result = inMemoryDatastore.addMember(args.roomId, { name: args.memberName, id: args.memberId })
        if (result.success || result.error === EErrorMessages.MemberAlreadyExists) {
            const room = inMemoryDatastore.getRoom(args.roomId)
            return room
        }

        return result
    },
}

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        joinRoom,
        createRoom,
    }),
})

export default RootMutationType
