import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLList,
    GraphQLEnumType,
} from 'graphql'

const RoomStatusEnum = new GraphQLEnumType({
    name: 'RoomStatusEnum',
    values: {
        signup: { value: 'signup' },
        voting: { value: 'voting' },
        conclusion: { value: 'conclusion' }
    }
})

const ParticipantType = new GraphQLObjectType({
    name: 'Participant',
    description: 'This represents a Participant',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

const AddDemoType = new GraphQLObjectType({
    name: 'AddDemo',
    description: 'This represents a demo added',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        roomId: { type: new GraphQLNonNull(GraphQLString) },
        demo: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

const AddVoteType = new GraphQLObjectType({
    name: 'AddVote',
    description: 'This represents a vote added',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        roomId: { type: new GraphQLNonNull(GraphQLString) },
        demoId: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

const DemoType = new GraphQLObjectType({
    name: 'Demo',
    description: 'This represents a Demo',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        demo: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

const VoteType = new GraphQLObjectType({
    name: 'Vote',
    description: 'This represents a Vote',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        demoId: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        roomId: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

const RoomType = new GraphQLObjectType({
    name: 'Room',
    description: 'This represents a Room',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        ownerId: { type: new GraphQLNonNull(GraphQLString) },
        maxVotes: { type: new GraphQLNonNull(GraphQLInt) },
        icon: { type: new GraphQLNonNull(GraphQLString) },
        members: { type: new GraphQLList(ParticipantType) },
        status: { type: RoomStatusEnum },
        demos: { type: new GraphQLList(DemoType) },
        votes: { type: new GraphQLList(VoteType) },
    }),
})

const MemberChangeType = new GraphQLObjectType({
    name: 'MemberChange',
    description: 'This represents a Member Change',
    fields: () => ({
        roomId: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        userName: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

const RoomUpdateType = new GraphQLObjectType({
    name: 'RoomUpdate',
    description: 'This represents a Room Update',
    fields: () => ({
        roomId: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(RoomStatusEnum) },
    }),
})

export {
    RoomType,
    MemberChangeType,
    RoomStatusEnum,
    RoomUpdateType,
    DemoType,
    AddDemoType,
    VoteType,
    AddVoteType
}
