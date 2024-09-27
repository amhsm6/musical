import React, { createContext, useReducer } from "react";

type State = number[];

type Action = {
    type: "play" | "play_next",
    track_id: number
};

const reducer: React.Reducer<State, Action> = (queue, action) => {
    switch (action.type) {
        case "play":
            return [action.track_id];
            break;

        case "play_next":
            return [...queue, action.track_id];
            break;
    }
};

type Queue = {
    queue: State,
    dispatch: React.Dispatch<Action>
};

const initial: Queue = { queue: [], dispatch: () => {} };

const QueueContext = createContext<Queue>(initial);

export default QueueContext;

type Props = { children: React.ReactNode };

export function QueueProvider({ children }: Props): React.ReactNode {
    const [queue, dispatch] = useReducer(reducer, initial.queue);
    return <QueueContext.Provider value={{ queue: queue, dispatch: dispatch }}>{ children }</QueueContext.Provider>;
}
