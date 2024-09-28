import React, { useContext } from "react";
import ReactNative, { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import QueueContext from "@/contexts/queue";
import Track from "@/components/Track";
import { Play, PlayNext } from "@/components/PlayIcons";
import type { Album } from "@/types/library";
import Feather from '@expo/vector-icons/Feather';

const styles = StyleSheet.create({
    container: {
        padding: 5,
        borderWidth: 3,
        borderColor: "#aaa",
        borderRadius: 5
    },
    album_header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15
    }
});

type Props = {
    title: string,
    album: Album,
    style?: ReactNative.ViewStyle
};

export default function Album({ title, album, style }: Props): React.ReactNode {
    const { dispatch } = useContext(QueueContext);

    return (
        <View style={{ ...styles.container, ...style }}>
            <View style={ styles.album_header }>
                <View style={{ width: "90%", flexDirection: "row" }}>
                    <Feather name="disc" size={ 50 } color="black" style={{ marginRight: 20 }} />
                    <View style={{ width: "90%" }}>
                        <Text style={{ fontSize: 25, fontWeight: "bold" }}>{ title }</Text>
                        <Text style={{ color: "#222" }}>{ album.album_artist || "Unknown Artist" }</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", marginTop: 10, marginRight: 15 }}>
                    <TouchableOpacity onPress={ () => dispatch({ type: "play", tracks: album.tracks }) } style={{ marginRight: 15 }}><Play size={ 30 } /></TouchableOpacity>
                    <TouchableOpacity onPress={ () => dispatch({ type: "play_next", tracks: album.tracks }) }><PlayNext size={ 30 } /></TouchableOpacity>
                </View>
            </View>
            <View>
                { album.tracks.map((t, i) => <Track track={ t } index={ i } key={ i } />) }
            </View>
        </View>
    );
}
