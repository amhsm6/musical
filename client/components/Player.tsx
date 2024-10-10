import React, { useState, useEffect, useContext } from "react";
import ReactNative, { Pressable, StyleSheet, View } from "react-native";
import QueueContext from "@/contexts/queue";
import ScrollingText from "@/components/ScrollingText";
import { Audio } from "expo-av";
import AntDesign from "@expo/vector-icons/AntDesign";

type PlayState = {
    playing: boolean,
    timestamp: number
};

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
    const { state, dispatch } = useContext(QueueContext);
    const track = state.playing_index === null ? null : state.queue[state.playing_index];

    const [playState, setPlayState] = useState<PlayState>({ playing: true, timestamp: 0 });

    useEffect(() => {
        if (!track) { return; }

        const sound = new Audio.Sound();

        setPlayState({ playing: true, timestamp: 0 });
    }, [track?.id]);

    if (!track) { return null; }

    return (
        <View style={{ ...styles.player, ...style }}>
            <View style={{ width: "80%", alignSelf: "flex-start", marginLeft: 30 }}>
                <ScrollingText style={{ fontSize: 18, fontWeight: "bold" }}>{ track.title }</ScrollingText>
                <ScrollingText>{ track.album || "Other" }</ScrollingText>
            </View>
            <View style={{ width: "25%", flexDirection: "row", justifyContent: "space-between" }}>
                <Pressable onPress={ () => dispatch({ type: "prev" }) }>
                    <AntDesign name="stepbackward" size={ 35 } />
                </Pressable>
                {
                    playState.playing ? (
                        <Pressable onPress={ () => setPlayState({ ...playState, playing: false }) }>
                            <AntDesign name="pause" size={ 35 } />
                        </Pressable>
                    ) : (
                        <Pressable onPress={ () => setPlayState({ ...playState, playing: true }) }>
                            <AntDesign name="play" size={ 35 } />
                        </Pressable>
                    )
                }
                <Pressable onPress={ () => dispatch({ type: "next" }) }>
                    <AntDesign name="stepforward" size={ 35 } />
                </Pressable>
            </View>
        </View>
    );
}
