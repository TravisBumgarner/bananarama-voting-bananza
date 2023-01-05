import axios from 'axios'
import { graphql } from 'graphql'
import { TRoom } from 'index'
import schema from '../schemas'
import { createBaseRoom } from './utilities'

beforeAll(async () => {
    try {
        await axios.get('http:/localhost:8080/ok')
    } catch {
        throw new Error('Backend is not running')
    }
})

let startingRoom: TRoom
beforeEach(async () => {
    startingRoom = await createBaseRoom()
})

describe('GraphQL Subscriptions', () => {

})
