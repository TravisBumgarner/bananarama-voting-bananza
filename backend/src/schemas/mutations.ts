import {
    GraphQLObjectType,
} from 'graphql'

import { EntryType } from './types'

const addEntry = {
    type: EntryType,
    description: 'Add an Entry',
    args: {
    },
    resolve: async () => {
        return 'foo got barred'
    },
}

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addEntry
    }),
})

export default RootMutationType
