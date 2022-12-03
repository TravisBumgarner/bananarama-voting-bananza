import { GraphQLList, GraphQLObjectType, } from 'graphql'

import { EntryType, } from './types'

const entry = {
    type: new GraphQLList(EntryType),
    description: 'List of Entries',
    args: {
    },
    resolve: async () => {
        return ([{
            foo: 'foo',
            bar: 'bar',
        }])
    },
}

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        entry,
    }),
})

export default RootQueryType
