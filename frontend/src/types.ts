type TParticipant = {
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
    ownerId: TParticipant['id']
    icon: 'banana'
    maxVotes: number
    members: TParticipant[]
    status: 'signup' | 'voting' | 'conclusion'
    demos: TDemo[]
    votes: TVote[]
}

type TMemberChange = {
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
    TParticipant,
    TRoom,
    TMemberChange,
    TRoomUpdate,
    TAddDemo,
    TDemo,
    TUser,
    TVote
}
