import React, { useState, useEffect, useContext, useRef } from "react";
import ReactNative, { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import QueueContext from "@/contexts/queue";
import ScrollingText from "@/components/ScrollingText";
import { Audio, AVPlaybackStatus } from "expo-av";
import AntDesign from "@expo/vector-icons/AntDesign";
import Slider from "@react-native-community/slider";

type PlayState = {
    playing: boolean,
    timestamp: number
};

type SystemPlayState = {
    loaded: boolean,
    playing: boolean,
    timestamp: number,
    duration: number | null
};

const styles = StyleSheet.create({
    player: {
        height: 140,
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

    const [playState, setPlayState] = useState<PlayState>({ playing: false, timestamp: 0 });
    const [systemPlayState, setSystemPlayState] = useState<SystemPlayState>({ loaded: false, playing: false, timestamp: 0, duration: null });

    const playStatusUpdate = (status: AVPlaybackStatus) => {
        setSystemPlayState(s => ({
            loaded: status.isLoaded,
            playing: status.isLoaded ? status.isPlaying : s.playing,
            timestamp: status.isLoaded ? status.positionMillis : s.timestamp,
            duration: (status.isLoaded && status.durationMillis) || null
        }));
    };

    const sound = useRef<Audio.Sound>(new Audio.Sound());
    sound.current.setOnPlaybackStatusUpdate(playStatusUpdate);

    useEffect(() => {
        if (!track) { return () => {}; }

        return () => {
            console.log("deload");
            sound.current.unloadAsync();
        };
    }, [track?.id]);

    useEffect(() => {
        if (!track || systemPlayState.loaded) { return () => {}; }

        const timeout = setTimeout(() => {
            console.log("load");
            sound.current.loadAsync(
                { uri: `${process.env.EXPO_PUBLIC_URL}/api/audio/stream/${track.id}` },
                { progressUpdateIntervalMillis: 500, shouldPlay: true, positionMillis: 0 }
            );
        }, 1000);

        return () => clearTimeout(timeout);
    }, [track?.id, systemPlayState.loaded]);

    useEffect(() => {
        if (!sound.current._loaded) { return; }

        console.log(playState);
        sound.current.setStatusAsync({ shouldPlay: playState.playing, positionMillis: playState.timestamp });
    }, [playState.playing, playState.timestamp]);

    useEffect(() => {
        if (systemPlayState.loaded) {
        }
    }, [systemPlayState.loaded, systemPlayState.playing, systemPlayState.timestamp, systemPlayState.duration]);

    if (!track) { return null; }

    return (
        <View style={{ ...styles.player, ...style }}>
            <View style={{ width: "100%", alignSelf: "flex-start", flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ width: "80%", marginLeft: 30 }}>
                    <ScrollingText style={{ fontSize: 18, fontWeight: "bold" }}>{ track.title }</ScrollingText>
                    <ScrollingText>{ track.album || "Other" }</ScrollingText>
                </View>
                {/* { audioState.processing && <ActivityIndicator style={{ marginRight: 20 }} /> } */}
            </View>
            <View style={{ width: "100%", paddingHorizontal: 40 }}>
                <Slider
                    minimumValue={ 0 }
                    maximumValue={ systemPlayState.duration || 0 }
                    value={ playState.timestamp }
                    onValueChange={ value => setPlayState({ ...playState, timestamp: value }) }
                    thumbImage={ require("@/assets/images/react-logo.png") }
                    thumbTintColor="#000"
                    minimumTrackTintColor="#000"
                />
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
