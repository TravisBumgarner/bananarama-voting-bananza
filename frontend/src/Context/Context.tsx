import { useReducer, createContext } from 'react'
import { TRoom, TEntry, TVote } from 'types'

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
    users: Record<string, string>
    entries: TEntry[]
    votes: TVote[]
}

const EMPTY_STATE: State = {
    message: null,
    hasErrored: false,
    user: null,
    users: {},
    room: null,
    entries: [],
    votes: []
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

type AddUsers = {
    type: 'ADD_USERS'
    data: Record<string, string>
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

type AddEntries = {
    type: 'ADD_ENTRIES',
    data: TEntry[]
}

type AddVotes = {
    type: 'ADD_VOTES',
    data: TVote[]
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
    | AddEntries
    | AddUsers
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
            return { ...EMPTY_STATE, user: state.user }
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
        case 'ADD_ENTRIES': {
            return { ...state, entries: [...state.entries, ...action.data] }
        }
        case 'ADD_VOTES': {
            return { ...state, votes: [...state.votes, ...action.data] }
        }
        case 'ADD_USERS': {
            return { ...state, users: { ...state.users, ...action.data } }
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
