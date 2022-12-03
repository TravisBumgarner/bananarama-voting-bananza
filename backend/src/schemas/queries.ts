import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

import inMemoryDatastore from '../inMemoryDatastore'
import { RoomType } from './types'

type RoomArgs = {
    id: string
}

const room = {
    type: RoomType,
    description: 'Get a roomRoom',
    args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (_, args: RoomArgs) => {
        const result = inMemoryDatastore.getRoom(args.id)

        return result
    },
}

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        room
    }),
})

export default RootQueryType
