type TParticipant = {
    id: string
    name: string
}

type TEntry = {
    id: string,
    userId: string
    entry: string
}

type TRoom = {
    id: string,
    ownerId: TParticipant['id'],
    icon: 'banana',
    maxVotes: number,
    members: TParticipant[]
    status: 'signup' | 'voting' | 'conclusion'
    entries: TEntry[]
}

enum EErrorMessages {
    RoomDoesNotExist = 'RoomDoesNotExist',
    MemberAlreadyExists = 'MemberAlreadyExists',
    MemberIsNotRoomOwner = 'MemberIsNotRoomOwner'
}

export {
    TParticipant,
    TRoom,
    EErrorMessages,
    TEntry
}
