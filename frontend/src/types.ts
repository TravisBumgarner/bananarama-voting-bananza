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

export {
    TParticipant,
    TRoom,
    TMemberChange
}
