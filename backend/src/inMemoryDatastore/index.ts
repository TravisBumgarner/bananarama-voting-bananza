import { hri } from 'human-readable-ids'

import { TRoom, TParticipant, EErrorMessages } from '../types'

type Success<T> = {
    success: true
    data?: T
}

type Failure = {
    success: false
    error: EErrorMessages
}

type Response<T = undefined> =
    | Failure
    | Success<T>

class InMemoryDatastore {
    rooms: Record<string, TRoom>

    constructor() {
        this.rooms = {}
    }

    createRoom(owner: TParticipant): Response<string> {
        const roomId = hri.random()
        this.rooms[roomId] = {
            id: roomId,
            ownerId: owner.id,
            maxVotes: 2,
            icon: 'banana',
            members: [owner]
        }
        console.log('created room', this.rooms[roomId])
        return {
            success: true,
            data: roomId
        }
    }

    getRoom(id: string): Response<TRoom> {
        if (id in this.rooms) {
            return ({ success: true, data: this.rooms[id] })
        }
        return ({ success: false, error: EErrorMessages.RoomDoesNotExist })
    }

    deleteRoom(id: string): Response {
        const wasDeleted = delete this.rooms[id]
        if (wasDeleted) {
            return {
                success: true
            }
        }
        return {
            success: false,
            error: EErrorMessages.RoomDoesNotExist
        }
    }

    addMember(roomId: string, member: TParticipant): Response {
        if (roomId in this.rooms) {
            const currentMemberIds = this.rooms[roomId].members.map(({ id }) => id)
            if (!currentMemberIds.includes(member.id)) {
                this.rooms[roomId].members.push(member)
                return {
                    success: true,
                }
            }
            return {
                success: false,
                error: EErrorMessages.MemberAlreadyExists
            }
        }
        return {
            success: false,
            error: EErrorMessages.RoomDoesNotExist
        }
    }
}

const inMemoryDatastore = new InMemoryDatastore()

export default inMemoryDatastore
