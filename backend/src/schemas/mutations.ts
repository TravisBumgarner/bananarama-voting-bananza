import { GraphQLNonNull, GraphQLObjectType, GraphQLString, } from 'graphql'
import { RedisPubSub } from 'graphql-redis-subscriptions'

import { EErrorMessages, TRoom } from '../types'
import inMemoryDatastore from '../inMemoryDatastore'
import { RoomStatusEnum, RoomType } from './types'

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
            return (result.data)
        }
        throw new Error(result.error)
    },
}

type UpdateRoomArgs = {
    userId: string
    roomId: string
    status: TRoom['status']
}

// Currently only designed around updating status.
const updateRoom = {
    type: RoomType,
    description: 'Update a Room',
    args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        roomId: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(RoomStatusEnum) },

    },
    resolve: async (_, args: UpdateRoomArgs) => {
        const currentRoomResult = inMemoryDatastore.getRoom(args.roomId)
        if (!currentRoomResult.success) throw new Error(currentRoomResult.error)

        const userIsNotOwner = currentRoomResult.success && currentRoomResult.data?.ownerId !== args.userId
        if (userIsNotOwner) throw new Error(EErrorMessages.MemberIsNotRoomOwner)

        const updateRoomResult = inMemoryDatastore.updateRoom({ id: args.roomId, status: args.status })

        if (updateRoomResult.success) return updateRoomResult.data

        throw new Error(updateRoomResult.error)
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
        updateRoom
    }),
})

export default RootMutationType
