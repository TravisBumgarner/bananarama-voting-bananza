import { useReducer, createContext } from 'react'
import { TRoom, TEntry } from 'types'

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
    }
    room: TRoom | null,
    users: Record<string, string>
    entries: TEntry[]
}

const EMPTY_STATE: State = {
    message: null,
    hasErrored: false,
    user: {
        name: 'Bob',
        id: 'bob'
    },
    users: {},
    room: null,
    entries: []
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

type Action =
    | AddMessage
    | DeleteMessage
    | HasErrored
    | Join
    | EnterRoom
    | UpdateRoom
    | AddEntries
    | AddUsers

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
