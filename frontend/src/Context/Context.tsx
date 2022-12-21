import { useReducer, createContext } from 'react'
import { TRoom, TDemo, TVote, TRoomMember } from 'types'

import { logger } from 'utilities'

type State = {
    message: {
        body: string,
        timeToLiveMS: number | undefined
    } | null
    hasErrored: boolean
    user: {
        name: string,
        id: string
    } | null
    room: TRoom | null,
}

const EMPTY_STATE: State = {
    message: null,
    hasErrored: false,
    user: null,
    room: null,
}

type HasErrored = {
    type: 'HAS_ERRORED'
}

type AddMessage = {
    type: 'ADD_MESSAGE'
    data: {
        message: string
        timeToLiveMS?: number
    }
}

type AddMembers = {
    type: 'ADD_MEMBERS'
    data: TRoomMember[]
}

type DeleteMessage = {
    type: 'DELETE_MESSAGE'
}

type Join = {
    type: 'JOIN'
    data: {
        name: string
        id: string
    }
}

type EnterRoom = {
    type: 'ENTER_ROOM'
    data: TRoom
}

type UpdateRoom = {
    type: 'UPDATE_ROOM'
    data: Partial<TRoom>
}

type AddDemos = {
    type: 'ADD_DEMOS',
    data: TDemo[]
}

type AddVotes = {
    type: 'ADD_VOTES',
    data: TVote[]
}

type AddWinners = {
    type: 'ADD_WINNERS',
    data: TDemo['id'][]
}

type ResetState = {
    type: 'RESET_ROOM_STATE',
}

type Action =
    | AddMessage
    | DeleteMessage
    | HasErrored
    | Join
    | EnterRoom
    | UpdateRoom
    | AddDemos
    | AddMembers
    | AddWinners
    | AddVotes
    | ResetState

const context = createContext(
    {
        state: EMPTY_STATE,
        dispatch: () => { },
    } as {
        state: State,
        dispatch: React.Dispatch<Action>
    },
)

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'RESET_ROOM_STATE': {
            return { ...state, room: null }
        }
        case 'HAS_ERRORED': {
            return { ...state, hasErrored: true }
        }
        case 'ADD_MESSAGE': {
            return { ...state, message: { body: action.data.message, timeToLiveMS: action.data.timeToLiveMS } }
        }
        case 'DELETE_MESSAGE': {
            return { ...state, message: null }
        }
        case 'JOIN': {
            return { ...state, user: { name: action.data.name, id: action.data.id } }
        }
        case 'ENTER_ROOM': {
            return { ...state, room: action.data }
        }
        case 'UPDATE_ROOM': {
            return { ...state, room: { ...state.room!, ...action.data } }
        }
        case 'ADD_DEMOS': {
            return { ...state, room: { ...state.room!, demos: [...state.room!.demos, ...action.data] } }
        }
        case 'ADD_WINNERS': {
            return {
                ...state, room: { ...state.room!, winners: [...action.data] }
            }
        }
        case 'ADD_VOTES': {
            return { ...state, room: { ...state.room!, votes: [...state.room!.votes, ...action.data] } }
        }
        case 'ADD_MEMBERS': {
            return { ...state, room: { ...state.room!, members: [...state.room!.members, ...action.data] } }
        }
        default: {
            logger(`Swallowing action: ${JSON.stringify(action)}`)
            return state
        }
    }
}

const ResultsContext = ({ children }: { children: React.ReactChild }) => {
    const [state, dispatch] = useReducer(reducer, EMPTY_STATE)

    const { Provider } = context

    return (
        <Provider value={{ state, dispatch }}>
            {children}
        </Provider>
    )
}

export default ResultsContext
export {
    context,
    Action,
}
