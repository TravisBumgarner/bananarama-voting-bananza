import { useReducer, createContext } from 'react'
import { User } from 'firebase/auth'

import { logger } from 'utilities'

type State = {
    message: {
        body: string,
        timeToLiveMS: number | undefined
    } | null
    appHydrated: boolean
    currentUser: User | null | undefined
    hasErrored: boolean
}

const EMPTY_STATE: State = {
    message: null,
    appHydrated: false,
    currentUser: undefined,
    hasErrored: false
}

type HasErrored = {
    type: 'HAS_ERRORED'
}

type UserSignup = {
    type: 'USER_SIGNED_UP'
    data: {
        currentUser: User
    }
}

type UserLogin = {
    type: 'USER_LOGGED_IN'
    data: {
        currentUser: User
    }
}

type UserSignedOut = {
    type: 'USER_SIGNED_OUT'
    data: {
        currentUser: null
    }
}

type AddMessage = {
    type: 'ADD_MESSAGE'
    data: {
        message: string
        timeToLiveMS?: number
    }
}

type DeleteMessage = {
    type: 'DELETE_MESSAGE'
}

type Action =
    | AddMessage
    | DeleteMessage
    | UserLogin
    | UserSignup
    | UserSignedOut
    | HasErrored

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
        case 'USER_SIGNED_OUT':
        case 'USER_LOGGED_IN':
        case 'USER_SIGNED_UP': {
            return { ...state, currentUser: action.data.currentUser }
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
