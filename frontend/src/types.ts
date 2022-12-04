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
    status: 'signup' | 'voting' | 'conclusion'
}

type TMemberChange = {
    memberId: string,
    memberName: string,
    roomId: string,
    status: 'join' | 'leave'
}

type TRoomUpdate = {
    roomId: string,
    status: TRoom['status']
}

export {
    TParticipant,
    TRoom,
    TMemberChange,
    TRoomUpdate
}
