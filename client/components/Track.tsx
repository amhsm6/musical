import React, { useContext } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import QueueContext from "@/contexts/queue";
import { Play, PlayNext } from "@/components/PlayIcons";
import type { Track } from "@/types/library";

const styles = StyleSheet.create({
    track: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 5,
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
                <Text style={{ width: "30%", fontWeight: "bold", marginRight: 20 }}>{ track.title }</Text>
                <Text>{ track.artist }</Text>
            </View>
            <View style={{ flexDirection: "row"  }}>
                <TouchableOpacity onPress={ () => dispatch({ type: "play", track_id: track.id }) } style={{ marginRight: 15 }}><Play size={ 30 } /></TouchableOpacity>
                <TouchableOpacity onPress={ () => dispatch({ type: "play_next", track_id: track.id }) }><PlayNext size={ 30 } /></TouchableOpacity>
            </View>
        </View>
    );
}
