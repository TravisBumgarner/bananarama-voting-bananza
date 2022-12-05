type TParticipant = {
    id: string
    name: string
}

type TEntry = {
    id: string,
    userId: string
    entry: string
}

type TVote = {
    id: string,
    userId: string,
    entryId: string
}

type TRoom = {
    id: string,
    ownerId: TParticipant['id'],
    icon: 'banana',
    maxVotes: number,
    members: TParticipant[]
    status: 'signup' | 'voting' | 'conclusion'
    entries: TEntry[],
    votes: TVote[]

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
    TEntry,
    TVote
}
