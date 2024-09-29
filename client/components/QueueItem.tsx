import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ScrollingText from "@/components/ScrollingText";
import type { Track } from "@/types/library";

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        padding: 5,
        borderTopColor: "silver"
    }
});

type Props = {
    track: Track,
    playing: boolean,
    index: number
};

export default function QueueItem({ track, playing, index }: Props): React.ReactNode {
    return (
        <View style={{ ...styles.row, borderTopWidth: index === 0 ? 0 : 3 }}>
            <View style={{ width: "70%" }}>
                <ScrollingText style={{ fontSize: 18, fontWeight: "bold" }}>{ track.title }</ScrollingText>
                <ScrollingText>{ track.album || "Other" }</ScrollingText>
            </View>
            <View style={{ marginRight: 20 }}>
                <Text>{ playing && "playing" }</Text>
            </View>
        </View>
    );
}
