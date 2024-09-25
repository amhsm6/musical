import React from "react";
import ReactNative, { View, Text, ActivityIndicator } from "react-native";
import useSWR from "swr";

const jsonfetch = (...args: any) => fetch(args).then(x => x.json());

type Props = {
    query: string,
    style?: ReactNative.ViewStyle
};

export default function Library({ query, style }: Props): React.ReactNode {
    const { data, isLoading, error } = useSWR(`http://localhost:3015/api/audio/query?q=${query}`, jsonfetch);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (error) {
        return <Text>{ error.toString() }</Text>;
    }

    return (
        <View style={ style }>
            <Text>{ data }</Text>
        </View>
    );
}
