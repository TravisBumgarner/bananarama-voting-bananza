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

export {
    EntryType,
}
