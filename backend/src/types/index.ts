type TParticipant = {
    id: string
    name: string
}

type TDemo = {
    id: string,
    userId: string
    demo: string
}

type TVote = {
    id: string,
    userId: string,
    demoId: string
}

type TRoom = {
    id: string,
    ownerId: TParticipant['id'],
    icon: 'banana',
    maxVotes: number,
    members: TParticipant[]
    status: 'signup' | 'voting' | 'conclusion'
    demos: TDemo[],
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
    TDemo,
    TVote
}
