type TRoomMember = {
    id: string
    name: string
}

type TDemo = {
    id: string
    userId: string
    roomId: string
    demo: string
}

type TVote = {
    id: string,
    userId: string,
    demoId: string,
    roomId: string
}

type TRoom = {
    id: string
    ownerId: TRoomMember['id']
    icon: 'banana'
    maxVotes: number
    members: TRoomMember[]
    status: 'signup' | 'voting' | 'conclusion'
    demos: TDemo[]
    votes: TVote[]
    winners: TDemo['id'][]
}

type TRoomMemberChange = {
    userId: string
    userName: string
    roomId: string
    status: 'join' | 'leave'
}

type TAddDemo = {
    userId: string
    roomId: string
    demo: string
}

type TRoomUpdate = {
    roomId: string
    status: TRoom['status']
    maxVotes?: number
}

type TUser = {
    id: string
    name: string
}

export {
    TRoomMember,
    TRoom,
    TRoomMemberChange,
    TRoomUpdate,
    TAddDemo,
    TDemo,
    TUser,
    TVote
}
