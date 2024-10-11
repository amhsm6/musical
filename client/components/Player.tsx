import React, { useState, useEffect, useContext, useRef } from "react";
import ReactNative, { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import QueueContext from "@/contexts/queue";
import ScrollingText from "@/components/ScrollingText";
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import AntDesign from "@expo/vector-icons/AntDesign";

type PlayState = {
    loaded: boolean,
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

// TODO: Disable next/prev buttons in the beginning and end of the queue

export default function Player({ style }: Props): React.ReactNode {
    const { state, dispatch } = useContext(QueueContext);
    const track = state.playing_index === null ? null : state.queue[state.playing_index];

    const [playState, setPlayState] = useState<PlayState>({ loaded: false, playing: false, timestamp: 0 });

    const playStatusUpdate = (status: AVPlaybackStatus) => {
        setPlayState(s => ({ ...s, loaded: status.isLoaded }));

        if (status.isLoaded) {
            setPlayState(s => ({ ...s, playing: status.isPlaying, timestamp: status.positionMillis }));
        }
    };

    const sound = useRef<Audio.Sound>(new Audio.Sound());
    sound.current.setOnPlaybackStatusUpdate(playStatusUpdate);

    useEffect(() => {
        if (!track) { return; }

        const eff = async () => {
            await sound.current.unloadAsync();
            setPlayState({ loaded: false, playing: false, timestamp: 0 });

            sound.current = new Audio.Sound();
            await sound.current.loadAsync(
                { uri: `${process.env.EXPO_PUBLIC_URL}/api/audio/stream/${track.id}` },
                { progressUpdateIntervalMillis: 500, shouldPlay: true }
            );
        };

        eff();
    }, [track?.id]);

    if (!track) { return null; }

    return (
        <View style={{ ...styles.player, ...style }}>
            { !playState.loaded && <ActivityIndicator /> }
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
                        <Pressable onPress={ () => sound.current.pauseAsync() }>
                            <AntDesign name="pause" size={ 35 } />
                        </Pressable>
                    ) : (
                        <Pressable onPress={ () => sound.current.playAsync() }>
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
