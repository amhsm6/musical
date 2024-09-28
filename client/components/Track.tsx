import React, { useContext } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import QueueContext from "@/contexts/queue";
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
                <Text numberOfLines={ 2 } style={{ width: "5%", marginRight: 10 }}>{ `${track.track_number || index + 1}.` }</Text>
                <Text numberOfLines={ 2 } style={{ width: "30%", fontWeight: "bold", marginRight: 20 }}>{ track.title }</Text>
                <Text numberOfLines={ 2 }>{ track.artist }</Text>
            </View>
            <View style={{ flexDirection: "row"  }}>
                <TouchableOpacity onPress={ () => dispatch({ type: "play", tracks: [track] }) } style={{ marginRight: 15 }}><Play size={ 25 } /></TouchableOpacity>
                <TouchableOpacity onPress={ () => dispatch({ type: "play_next", tracks: [track] }) }><PlayNext size={ 25 } /></TouchableOpacity>
            </View>
        </View>
    );
}
