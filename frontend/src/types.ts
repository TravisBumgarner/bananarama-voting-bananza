type TParticipant = {
    id: string
    name: string
}

type TEntry = {
    id: string
    userId: string
    roomId: string
    entry: string
}

type TRoom = {
    id: string
    ownerId: TParticipant['id']
    icon: 'banana'
    maxVotes: number
    members: TParticipant[]
    status: 'signup' | 'voting' | 'conclusion'
    entries: TEntry[]
}

type TMemberChange = {
    userId: string
    userName: string
    roomId: string
    status: 'join' | 'leave'
}

type TAddEntry = {
    userId: string
    roomId: string
    entry: string
}

type TRoomUpdate = {
    roomId: string
    status: TRoom['status']
}

type TUser = {
    id: string
    name: string
}

export {
    TParticipant,
    TRoom,
    TMemberChange,
    TRoomUpdate,
    TAddEntry,
    TEntry,
    TUser,
}
