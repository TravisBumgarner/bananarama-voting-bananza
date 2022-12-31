import axios from 'axios'
import { graphql } from 'graphql'
import { TRoom } from 'index'
import schema from '../schemas'

beforeAll(async () => {
    try {
        await axios.get('http:/localhost:8080/ok')
    } catch {
        throw new Error('Backend is not running')
    }
})

let createRoom: TRoom
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

    it('updates a room in different ways', async () => {
        const deleteRoomSource = `
            mutation {
                deleteRoom(id: "${createRoom.id}", userId: "${createRoom.ownerId}") {
                    id
                }
            }
        `
        const { data: { deleteRoom } } = await graphql({ schema, source: deleteRoomSource }) as { data: { deleteRoom: { id: string } } }
        expect(deleteRoom.id).toEqual(createRoom.id)
        // Need a test for subscription
    })

    it('updates a room in different ways', async () => {
        const roomUpdates1: Partial<TRoom> = {
            status: 'voting',
            maxVotes: 4
        }
        const updateRoomSource1 = `
            mutation {
                updateRoom(
                    userId: "${createRoom.ownerId}",
                    roomId:"${createRoom.id}",
                    status: ${roomUpdates1.status},
                    maxVotes: ${roomUpdates1.maxVotes}
                ) {
                    id,
                    status,
                    maxVotes
                }
            }
        `
        // Need to figure out how to show errors when they occur. Currently they get swallowed
        // Probably an issue with `as X`
        const { data: { updateRoom } } = await graphql({ schema, source: updateRoomSource1 }) as { data: { updateRoom: Partial<TRoom> } }

        const expected1: Partial<TRoom> = { ...createRoom, ...roomUpdates1 }
        expect(expected1.id).toEqual(updateRoom.id)
        expect(expected1.status).toEqual(updateRoom.status)
        expect(expected1.maxVotes).toEqual(updateRoom.maxVotes)

        // const roomUpdates2: Partial<TRoom> = {
        //     status: 'conclusion',
        // }
        // const updateRoomSource2 = `
        //     mutation {
        //         updateRoom(userId: "${createRoom.ownerId}", roomId:"${createRoom.id}", status: ${roomUpdates2.status}) {
        //             id,
        //             status
        //         }
        //     }
        // `
        // const { data: { updateRoom: actual2 } } = await graphql({ schema, source: updateRoomSource2 }) as { data: { updateRoom: Partial<TRoom> } }
        // const expected2: Partial<TRoom> = { ...createRoom, ...roomUpdates2 }
        // expect(expected2.status).toEqual(actual2.status)
    })
})
