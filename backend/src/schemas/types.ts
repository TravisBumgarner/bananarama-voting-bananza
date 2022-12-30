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
        conclusion: { value: 'conclusion' },
        deletion: { value: 'deletion' }
    }
})

const RoomMemberType = new GraphQLObjectType({
    name: 'RoomMember',
    description: 'This represents a Room Member',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

const DemoSubscription = new GraphQLObjectType({
    name: 'DemoSubscription',
    description: 'This represents a demo added',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        presenter: { type: new GraphQLNonNull(GraphQLString) },
        roomId: { type: new GraphQLNonNull(GraphQLString) },
        demo: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

const VoteSubscription = new GraphQLObjectType({
    name: 'VoteSubscription',
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
        presenter: { type: new GraphQLNonNull(GraphQLString) },
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
        members: { type: new GraphQLList(RoomMemberType) },
        status: { type: RoomStatusEnum },
        demos: { type: new GraphQLList(DemoType) },
        votes: { type: new GraphQLList(VoteType) },
    }),
})

const MemberSubscription = new GraphQLObjectType({
    name: 'MemberSubscription',
    description: 'This represents a Member Change',
    fields: () => ({
        roomId: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        userName: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

const RoomSubscription = new GraphQLObjectType({
    name: 'RoomSubscription',
    description: 'This represents a Room Update',
    fields: () => ({
        roomId: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(RoomStatusEnum) },
        maxVotes: { type: GraphQLInt },
    }),
})

export {
    RoomType,
    MemberSubscription,
    RoomStatusEnum,
    RoomSubscription,
    DemoType,
    VoteSubscription,
    VoteType,
    DemoSubscription
}
