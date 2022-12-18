type TRoomMember = {
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
    ownerId: TRoomMember['id'],
    icon: 'banana',
    maxVotes: number,
    members: TRoomMember[]
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
    TRoomMember,
    TRoom,
    EErrorMessages,
    TDemo,
    TVote
}
