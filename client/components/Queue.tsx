import React, { useContext } from "react";
import ReactNative, { StyleSheet, View, Text, FlatList } from "react-native";
import QueueContext from "@/contexts/queue";
import QueueItem from "@/components/QueueItem";

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderWidth: 3,
        borderRadius: 5,
        borderColor: "black"
    }
});

type Props = { style?: ReactNative.ViewStyle };

export default function Queue({ style }: Props): React.ReactNode {
    const { state } = useContext(QueueContext);

    return (
        <View style={{ ...styles.container, ...style }}>
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>Play Queue</Text>
            <FlatList
                data={ state.queue }
                keyExtractor={ (_, index) => index.toString() }
                renderItem={ ({ item, index }) => <QueueItem track={ item } playing={ state.playing_index === index } index={ index } /> }
            />
        </View>
    );
}
