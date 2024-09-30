import React, { useContext } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import QueueContext from "@/contexts/queue";
import ScrollingText from "@/components/ScrollingText";
import { Play, PlayNext } from "@/components/PlayIcons";
import type { Track } from "@/types/library";

const styles = StyleSheet.create({
    track: {
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
    index: number
};

export default function Track({ track, index }: Props): React.ReactNode {
    const { dispatch } = useContext(QueueContext);

    return (
        <View style={{ ...styles.track, borderTopWidth: index === 0 ? 0 : 3 }}>
            <View style={{ width: "90%", flexDirection: "row" }}>
                <Text style={{ width: "5%", marginRight: 10 }}>{ `${track.track_number || index + 1}.` }</Text>
                <View style={{ width: "30%", marginRight: 20 }}>
                    <ScrollingText style={{ fontWeight: "bold" }}>{ track.title }</ScrollingText>
                </View>
                <View style={{ width: "30%" }}>
                    <ScrollingText>{ track.artist }</ScrollingText>
                </View>
            </View>
            <View style={{ flexDirection: "row"  }}>
                <Pressable onPress={ () => dispatch({ type: "play", tracks: [track] }) } style={{ marginRight: 15 }}><Play size={ 25 } /></Pressable>
                <Pressable onPress={ () => dispatch({ type: "play_next", tracks: [track] }) }><PlayNext size={ 25 } /></Pressable>
            </View>
        </View>
    );
}
