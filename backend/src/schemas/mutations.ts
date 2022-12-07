import { GraphQLNonNull, GraphQLObjectType, GraphQLString, } from 'graphql'

import pubsub, { EPubSubMessage } from '../pubsub'
import { EErrorMessages, TRoom } from '../types'
import inMemoryDatastore from '../inMemoryDatastore'
import { RoomStatusEnum, RoomType, EntryType, VoteType } from './types'

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

        if (updateRoomResult.success) {
            await pubsub.publish(EPubSubMessage.ROOM_UPDATE_EVENT, {
                roomId: args.roomId,
                status: args.status
            })

            return updateRoomResult.data
        }

        throw new Error(updateRoomResult.error)
    },
}

type JoinRoomArgs = {
    roomId: string
    userId: string
    userName: string
}

const joinRoom = {
    type: RoomType,
    description: 'Join a Room',
    args: {
        roomId: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        userName: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args: JoinRoomArgs) => {
        const addMemberResult = inMemoryDatastore.addMember(args.roomId, { name: args.userName, id: args.userId })
        if (addMemberResult.success || addMemberResult.error === EErrorMessages.MemberAlreadyExists) {
            if (addMemberResult.success) {
                await pubsub.publish(EPubSubMessage.MEMBER_CHANGE_EVENT, {
                    roomId: args.roomId,
                    userId: args.userId,
                    userName: args.userName,
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

type AddEntryArgs = {
    roomId: string
    userId: string
    entry: string
}

const addEntry = {
    type: EntryType,
    description: 'Create an Entry',
    args: {
        roomId: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        entry: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args: AddEntryArgs) => {
        const addEntryResult = inMemoryDatastore.addEntry(args.roomId, args.userId, args.entry)
        if (addEntryResult.success) {
            await pubsub.publish(EPubSubMessage.ADD_ENTRY, { ...addEntryResult.data, roomId: args.roomId })
            return addEntryResult.data
        }
        throw new Error(addEntryResult.error)
    },
}

type AddVoteArgs = {
    roomId: string
    userId: string
    entryId: string
}

const addVote = {
    type: VoteType,
    description: 'Create a Vote',
    args: {
        roomId: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        entryId: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args: AddVoteArgs) => {
        const addVoteResult = inMemoryDatastore.addVote(args.roomId, args.userId, args.entryId)
        if (addVoteResult.success) {
            await pubsub.publish(EPubSubMessage.ADD_VOTE, { ...addVoteResult.data, roomId: args.roomId })
            return addVoteResult.data
        }
        throw new Error(addVoteResult.error)
    },
}

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        joinRoom,
        createRoom,
        updateRoom,
        addEntry,
        addVote
    }),
})

export default RootMutationType
