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

const AddEntryType = new GraphQLObjectType({
    name: 'AddEntry',
    description: 'This represents an entry added',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        roomId: { type: new GraphQLNonNull(GraphQLString) },
        entry: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

const AddVoteType = new GraphQLObjectType({
    name: 'AddVote',
    description: 'This represents an entry added',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        roomId: { type: new GraphQLNonNull(GraphQLString) },
        entryId: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

const EntryType = new GraphQLObjectType({
    name: 'Entry',
    description: 'This represents an Entry',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        entry: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

const VoteType = new GraphQLObjectType({
    name: 'Vote',
    description: 'This represents a Vote',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        entryId: { type: new GraphQLNonNull(GraphQLString) },
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
        entries: { type: new GraphQLList(EntryType) },
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
    EntryType,
    AddEntryType,
    VoteType,
    AddVoteType
}
