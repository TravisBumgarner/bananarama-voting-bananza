import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
} from 'graphql'

const EntryType = new GraphQLObjectType({
    name: 'Entry',
    description: 'This represents an Entry',
    fields: () => ({
        foo: { type: new GraphQLNonNull(GraphQLString) },
        bar: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

const RoomType = new GraphQLObjectType({
    name: 'Room',
    description: 'This represents a Room',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
    }),
})

export {
    EntryType,
    RoomType
}
