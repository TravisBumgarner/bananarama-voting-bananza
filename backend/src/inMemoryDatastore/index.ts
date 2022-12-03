import { hri } from 'human-readable-ids'

type Participant = {
    id: string
    name: string
}

type Room = {
    id: string,
    ownerId: Participant['id'],
    icon: 'banana',
    maxVotes: number,
    members: Participant[]
}

enum ErrorMessages {
    MemberAlreadyExists = 'MemberAlreadyExists',
    RoomDoesNotExist = 'RoomDoesNotExist'
}

class InMemoryDatastore {
    rooms: Record<string, Room>

    constructor() {
        this.rooms = {
            'unlucky-monkey-65': {
                id: 'unlucky-monkey-65',
                ownerId: 'foobar',
                icon: 'banana',
                maxVotes: 2,
                members: []
            }
        }
    }

    createRoom(owner: Participant) {
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

    getRoom(id: string): Room | undefined {
        return this.rooms[id]
    }

    deleteRoom(id: string) {
        return delete this.rooms[id]
    }

    addMember(roomId: string, member: Participant) {
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
                error: ErrorMessages.MemberAlreadyExists
            }
        }
        return {
            success: false,
            error: ErrorMessages.RoomDoesNotExist
        }
    }
}

const inMemoryDatastore = new InMemoryDatastore()

export default inMemoryDatastore
export { ErrorMessages }
