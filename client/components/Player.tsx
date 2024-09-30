import React, { useContext } from "react";
import ReactNative, { StyleSheet, View } from "react-native";
import QueueContext from "@/contexts/queue";
import ScrollingText from "@/components/ScrollingText";
import AntDesign from "@expo/vector-icons/AntDesign";

const styles = StyleSheet.create({
    player: {
        height: 120,
        paddingVertical: 5,
        justifyContent: "space-around",
        alignItems: "center",
        borderWidth: 3,
        borderRadius: 15,
        borderColor: "black"
    }
});

type Props = { style?: ReactNative.ViewStyle };

export default function Player({ style }: Props): React.ReactNode {
    const { state } = useContext(QueueContext);

    if (state.playing_index === null) { return null; }

    const track = state.queue[state.playing_index];

    return (
        <View style={{ ...styles.player, ...style }}>
            <View style={{ width: "80%", alignSelf: "flex-start", marginLeft: 30 }}>
                <ScrollingText style={{ fontSize: 18, fontWeight: "bold" }}>{ track.title }</ScrollingText>
                <ScrollingText>{ track.album || "Other" }</ScrollingText>
            </View>
            <View style={{ width: "25%", flexDirection: "row", justifyContent: "space-between" }}>
                <AntDesign name="stepbackward" size={ 35 } />
                <AntDesign name="play" size={ 35 } />
                <AntDesign name="stepforward" size={ 35 } />
            </View>
        </View>
    );
}
