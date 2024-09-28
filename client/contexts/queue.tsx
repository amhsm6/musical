import React, { createContext, useReducer } from "react";
import type { Track } from "@/types/library";

type State = {
    queue: Track[],
    playing_index: number | null
};

const initial: State = { queue: [], playing_index: null };

type Action = {
    type: "play" | "play_next",
    tracks: Track[]
};

const reducer: React.Reducer<State, Action> = (state, action) => {
    switch (action.type) {
        case "play":
            return {
                queue: action.tracks,
                playing_index: 0
            };
            break;

        case "play_next":
            return {
                ...state,
                queue: [...state.queue, ...action.tracks]
            };
            break;
    }
};

type Queue = {
    state: State,
    dispatch: React.Dispatch<Action>
};

const QueueContext = createContext<Queue>({ state: initial, dispatch: () => {} });

export default QueueContext;

type Props = { children: React.ReactNode };

export function QueueProvider({ children }: Props): React.ReactNode {
    const [state, dispatch] = useReducer(reducer, initial);
    return <QueueContext.Provider value={{ state: state, dispatch: dispatch }}>{ children }</QueueContext.Provider>;
}
