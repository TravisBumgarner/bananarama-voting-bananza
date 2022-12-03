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
    MemberAlreadyExists = 'MemberAlreadyExists',
    RoomDoesNotExist = 'RoomDoesNotExist'
}

export {
    TParticipant,
    TRoom,
    EErrorMessages
}
