import React, { createContext, useEffect, useReducer } from "react";
import type { Track } from "@/types/library";
import AsyncStorage from "@react-native-async-storage/async-storage";

type State = {
    queue: Track[],
    playing_index: number | null
};

const initial: State = { queue: [], playing_index: null };

type Action = { type: "load", state: State }
            | { type: "play", tracks: Track[] }
            | { type: "play_next", tracks: Track[] }
            | { type: "clear" }
            | { type: "shuffle" }
            | { type: "prev" }
            | { type: "next" };

const reducer: React.Reducer<State, Action> = (state, action) => {
    switch (action.type) {
        case "load":
            return action.state;

        case "play":
            return {
                queue: [...action.tracks],
                playing_index: 0
            };

        case "play_next":
            return {
                queue: [...state.queue, ...action.tracks],
                playing_index: state.playing_index || 0
            };

        case "clear":
            return initial;

        case "shuffle":
            const queue = state.queue;

            let start = 0;
            let end = queue.length;

            if (state.playing_index != null) {
                [queue[0], queue[state.playing_index]] = [queue[state.playing_index], queue[0]];
                start = 1;
            }

            while (start < end) {
                const i = Math.floor(start + Math.random() * (end - start));
                end--;

                [queue[i], queue[end]] = [queue[end], queue[i]];
            }

            return {
                queue,
                playing_index: 0
            };

        case "prev":
            return {
                ...state,
                playing_index: state.playing_index ? state.playing_index - 1 : state.playing_index
            };

        case "next":
            return {
                ...state,
                playing_index: state.playing_index != null && state.playing_index < state.queue.length - 1 ? state.playing_index + 1 : state.playing_index
            };
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

    useEffect(() => {
        AsyncStorage.getItem("queue").then(q => q && dispatch({ type: "load", state: JSON.parse(q) }));
    }, []);

    useEffect(() => {
        AsyncStorage.setItem("queue", JSON.stringify(state));
    }, [state]);

    return <QueueContext.Provider value={{ state, dispatch }}>{ children }</QueueContext.Provider>;
}
