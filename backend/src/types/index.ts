type TParticipant = {
    id: string
    name: string
}

type TRoom = {
    id: string,
    ownerId: TParticipant['id'],
    icon: 'banana',
    maxVotes: number,
    members: TParticipant[]
}

enum EErrorMessages {
    RoomDoesNotExist = 'RoomDoesNotExist',
    MemberAlreadyExists = 'MemberAlreadyExists',
}

export {
    TParticipant,
    TRoom,
    EErrorMessages
}
