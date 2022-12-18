type TMember = {
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
    ownerId: TMember['id'],
    icon: 'banana',
    maxVotes: number,
    members: TMember[]
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
    TMember,
    TRoom,
    EErrorMessages,
    TDemo,
    TVote
}
