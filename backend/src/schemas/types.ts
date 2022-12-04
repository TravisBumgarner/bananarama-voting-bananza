import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLList,
} from 'graphql'

const ParticipantType = new GraphQLObjectType({
    name: 'Participant',
    description: 'This represents a Participant',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
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
        members: { type: new GraphQLList(ParticipantType) }
    }),
})

const MemberChangeType = new GraphQLObjectType({
    name: 'MemberChange',
    description: 'This represents a MemberChange',
    fields: () => ({
        roomId: { type: new GraphQLNonNull(GraphQLString) },
        memberId: { type: new GraphQLNonNull(GraphQLString) },
        memberName: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

export {
    RoomType,
    MemberChangeType
}
