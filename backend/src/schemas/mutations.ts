import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString, } from 'graphql'

import pubsub, { EPubSubMessage } from '../pubsub'
import { EErrorMessages, TRoom } from '../types'
import inMemoryDatastore from '../inMemoryDatastore'
import { RoomStatusEnum, RoomType, DemoType, VoteType } from './types'

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
    maxVotes?: number
}

// Currently only designed around updating status.
const updateRoom = {
    type: RoomType,
    description: 'Update a Room',
    args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        roomId: { type: new GraphQLNonNull(GraphQLString) },
        maxVotes: { type: GraphQLInt },
        status: { type: new GraphQLNonNull(RoomStatusEnum) },

    },
    resolve: async (_, args: UpdateRoomArgs) => {
        const currentRoomResult = inMemoryDatastore.getRoom(args.roomId)
        if (!currentRoomResult.success) throw new Error(currentRoomResult.error)

        const userIsNotOwner = currentRoomResult.success && currentRoomResult.data?.ownerId !== args.userId
        if (userIsNotOwner) throw new Error(EErrorMessages.MemberIsNotRoomOwner)
        const updateRoomResult = inMemoryDatastore.updateRoom({
            id: args.roomId,
            status: args.status,
            ...(args.maxVotes ? { maxVotes: args.maxVotes } : {})
        })

        if (updateRoomResult.success) {
            await pubsub.publish(EPubSubMessage.ROOM_UPDATE_EVENT, {
                roomId: args.roomId,
                status: args.status,
                ...(args.maxVotes ? { maxVotes: args.maxVotes } : {})
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

type AddDemoArgs = {
    roomId: string
    userId: string
    demo: string
}

const addDemo = {
    type: DemoType,
    description: 'Create a Demo',
    args: {
        roomId: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        demo: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args: AddDemoArgs) => {
        const addDemoResult = inMemoryDatastore.addDemo(args.roomId, args.userId, args.demo)
        if (addDemoResult.success) {
            await pubsub.publish(EPubSubMessage.ADD_DEMO, { ...addDemoResult.data, roomId: args.roomId })
            return addDemoResult.data
        }
        throw new Error(addDemoResult.error)
    },
}

type AddVoteArgs = {
    roomId: string
    userId: string
    demoId: string
}

const addVote = {
    type: VoteType,
    description: 'Create a Vote',
    args: {
        roomId: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        demoId: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args: AddVoteArgs) => {
        const addVoteResult = inMemoryDatastore.addVote(args.roomId, args.userId, args.demoId)
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
        addDemo,
        addVote
    }),
})

export default RootMutationType
