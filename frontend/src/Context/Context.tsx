import { useReducer, createContext } from 'react'

import { logger } from 'utilities'

type State = {
    message: {
        body: string,
        timeToLiveMS: number | undefined
    } | null
    hasErrored: boolean
    name: string
}

const EMPTY_STATE: State = {
    message: null,
    hasErrored: false,
    name: 'bob'
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

type DeleteMessage = {
    type: 'DELETE_MESSAGE'
}

type Join = {
    type: 'JOIN'
    data: {
        name: string
    }
}

type Action =
    | AddMessage
    | DeleteMessage
    | HasErrored
    | Join

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
            return { ...state, name: action.data.name }
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
