import { graphql } from 'graphql'
import { TRoom } from 'index'
import schema from '../schemas'

const createBaseRoom = async () => {
    const args = {
        ownerId: 'bobid',
        ownerName: 'bobname'
    }

    const createRoomSource = `
        mutation {
            createRoom(ownerId: "${args.ownerId}", ownerName: "${args.ownerName}") {
                ownerId,
                id
            }
        }
    `
    const { data } = await graphql({ schema, source: createRoomSource })
    return (data!.createRoom) as TRoom
}

export {
    createBaseRoom
}
