import { hri } from 'human-readable-ids'

import { TRoom, TParticipant, EErrorMessages } from '../types'

class InMemoryDatastore {
    rooms: Record<string, TRoom>

    constructor() {
        this.rooms = {
            'unlucky-monkey-65': {
                id: 'unlucky-monkey-65',
                ownerId: 'foobar',
                icon: 'banana',
                maxVotes: 2,
                members: [{
                    name: 'foobar',
                    id: 'foobar'
                }]
            }
        }
    }

    createRoom(owner: TParticipant) {
        const roomId = hri.random()
        this.rooms[roomId] = {
            id: roomId,
            ownerId: owner.id,
            maxVotes: 2,
            icon: 'banana',
            members: [owner]
        }
        return roomId
    }

    getRoom(id: string): TRoom | undefined {
        return this.rooms[id]
    }

    deleteRoom(id: string) {
        return delete this.rooms[id]
    }

    addMember(roomId: string, member: TParticipant) {
        if (roomId in this.rooms) {
            const currentMemberIds = this.rooms[roomId].members.map(({ id }) => id)

            if (!(member.id in currentMemberIds)) {
                this.rooms[roomId].members.push(member)
                return {
                    success: true
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
