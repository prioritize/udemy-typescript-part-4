import {createContext, type ReactNode, useContext, useReducer} from "react";
import Timer from "../components/Timer.tsx";

export interface Timer {
    name: string,
    duration: number,
}

interface TimersState {
    isRunning: boolean,
    timers: Timer[]
}
const initialState: TimersState = {
    isRunning: false,
    timers: [],
}

    type TimersContextValue = TimersState & {
    addTimer: (timerData: Timer) => void,
    startTimers: () => void,
    stopTimers: () => void,
};
const TimersContext = createContext<TimersContextValue | null>(null);
export function useTimersContext() {
    const timersCtx = useContext(TimersContext);
    if (timersCtx === null) {
        throw new Error('TimersContext is null -- that shouldn\'t be the case');
    }
    return timersCtx;
}

interface TimersContextProviderProps {
    children: ReactNode
}
interface StartTimersAction {
    type: 'start'
}
interface StopTimersAction {
    type: 'stop'
}
interface AddTimersAction {
    type: 'add',
    payload: Timer
}
type Action = StartTimersAction | StopTimersAction | AddTimersAction;
function timersReducer(state: TimersState, action: Action): TimersState {
    if (action.type === 'start') {
        return {
            ...state,
            isRunning: true
        }
    } else if (action.type === 'stop') {
        return {
            ...state, isRunning: false
        }
    } else if (action.type ==='add') {
        return {
            ...state,
            timers: [...state.timers, {name: action.payload.name, duration: action.payload.duration}]
        }
    }
    return state;
}
export default function TimersContextProvider({children}: TimersContextProviderProps) {
    const [timersState, dispatch] = useReducer(timersReducer, initialState);
    const ctx: TimersContextValue = {
        timers: timersState.timers,
        isRunning: timersState.isRunning,
        addTimer(timerData) {
            dispatch({type: 'add', payload: timerData})
        },
        startTimers() {
            dispatch({type: 'start'})
        },
        stopTimers() {
            dispatch({type:'stop'});
        },
    };
    return <TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>
}
