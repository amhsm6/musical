import React from "react";
import ReactNative, { StyleSheet, Text, ActivityIndicator, FlatList } from "react-native";
import useSWR from "swr";
import Album from "@/components/Album";
import type { QueryResult } from "@/types/library";

const styles = StyleSheet.create({
    album: {
        marginTop: 20
    }
});

const jsonfetch = (...args: any) => fetch(args).then(x => x.json());

type Props = {
    query: string,
    style?: ReactNative.ViewStyle
};

export default function Library({ query, style }: Props): React.ReactNode {
    const { data, isLoading, error } = useSWR<QueryResult>(`http://localhost:3015/api/audio/query?q=${query}`, jsonfetch);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (error || !data) {
        return <Text>{ error.toString() }</Text>;
    }

    return (
        <FlatList
            data={ Object.entries(data) }
            renderItem={ ({ item }) => <Album title={ item[0] } album={ item[1] } style={ styles.album } /> }
            style={ style }
        >
        </FlatList>
    );
}
