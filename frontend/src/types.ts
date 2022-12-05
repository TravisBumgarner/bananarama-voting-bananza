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

type TVote = {
    id: string,
    userId: string,
    entryId: string,
    roomId: string
}

type TRoom = {
    id: string
    ownerId: TParticipant['id']
    icon: 'banana'
    maxVotes: number
    members: TParticipant[]
    status: 'signup' | 'voting' | 'conclusion'
    entries: TEntry[]
    votes: TVote[]
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
    TVote
}
