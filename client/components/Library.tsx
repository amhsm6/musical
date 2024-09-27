import React from "react";
import ReactNative, { StyleSheet, Text, ActivityIndicator, FlatList } from "react-native";
import useSWR from "swr";
import Album from "@/components/Album";
import type { QueryResult } from "@/types/library";

const styles = StyleSheet.create({
    list: {
        paddingHorizontal: 20
    },
    album: {
        marginBottom: 20
    }
});

const jsonfetch = (...args: any) => fetch(args).then(x => x.json());

type Props = {
    query: string,
    style?: ReactNative.ViewStyle
};

export default function Library({ query, style }: Props): React.ReactNode {
    const { data, isLoading, error } = useSWR<QueryResult>(`${process.env.EXPO_PUBLIC_URL}/api/audio/query?q=${query}`, jsonfetch);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (error || !data) {
        return <Text>{ error.toString() }</Text>;
    }

    return (
        <FlatList
            data={ Object.entries(data) }
            renderItem={ ({ item }) => <Album title={ item[0] || "Other" } album={ item[1] } style={ styles.album } /> }
            style={{ ...styles.list, ...style }}
        >
        </FlatList>
    );
}
