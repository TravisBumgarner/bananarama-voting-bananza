import axios from 'axios'
import { graphql } from 'graphql'
import schema from '../schemas'

beforeAll(async () => {
    try {
        await axios.get('http:/localhost:8080/ok')
    } catch {
        throw new Error('Backend is not running')
    }
})

let createRoom
beforeEach(async () => {
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
    const { data } = await graphql({ schema, source: createRoomSource }) as any
    createRoom = data.createRoom
})

describe('GRAPHQL API', () => {
    it('gets a room', async () => {
        const roomSource = `
            query {
                room(id: "${createRoom.id}") {
                    ownerId,
                    id
                }
            }
        `
        const { data: { room } } = await graphql({ schema, source: roomSource }) as any
        expect(room.id).toEqual(createRoom.id)
    })

    it('deletes a room', async () => {
        const deleteRoomSource = `
            mutation {
                deleteRoom(id: "${createRoom.id}", userId: "${createRoom.ownerId}") {
                    id
                }
            }
        `
        const { data: { deleteRoom } } = await graphql({ schema, source: deleteRoomSource }) as any
        expect(deleteRoom.id).toEqual(createRoom.id)
        // Need a test for subscription
    })
})
