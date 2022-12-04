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
        const result = inMemoryDatastore.createRoom({ id: args.ownerId, name: args.ownerName })
        if (result.success) {
            return ({
                id: result.data
            })
        }
        throw new Error(result.error)
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
        const addMemberResult = inMemoryDatastore.addMember(args.roomId, { name: args.memberName, id: args.memberId })
        if (addMemberResult.success || addMemberResult.error === EErrorMessages.MemberAlreadyExists) {
            if (addMemberResult.success) {
                await pubsub.publish('MEMBER_CHANGE_EVENT', {
                    roomId: args.roomId,
                    memberId: args.memberId,
                    memberName: args.memberName,
                    status: 'join'
                })
            }
            const getRoomResult = inMemoryDatastore.getRoom(args.roomId)
            if (getRoomResult.success) {
                return getRoomResult.data
            }
            throw new Error(getRoomResult.error)
        }
        throw new Error(addMemberResult.error)
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
