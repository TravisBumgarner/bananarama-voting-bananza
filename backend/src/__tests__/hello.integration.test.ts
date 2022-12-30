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

const expectQuery = async (query: string, expected: any) => {
    expect(await graphql({ schema, source: query })).toEqual(expected)
}

// Perhaps before each, create a new room

describe('GRAPHQL API', () => {
    it('create and get a room', async () => {
        const args = {
            ownerId: 'bobid',
            ownerName: 'bobname'
        }
        await expectQuery(
            `
                mutation {
                    createRoom(ownerId: "${args.ownerId}", ownerName: "${args.ownerName}") {
                        ownerId,
                    }
                }
            `,
            {
                data: {
                    createRoom: {
                        ownerId: args.ownerId
                    }
                }
            }
        )
    })

    it.skip('add a demo and update room', async () => { })
    it.skip('not collide with other rooms', async () => { })

    it.skip('join a room', async () => { })
    it.skip('add a demo', async () => { })
    it.skip('create a room', async () => { })
    it.skip('create a room', async () => { })
    it.skip('create a room', async () => { })
    it.skip('create a room', async () => { })
    it.skip('create a room', async () => { })
    it.skip('create a room', async () => { })
    it.skip('create a room', async () => { })
    it.skip('create a room', async () => { })
})
