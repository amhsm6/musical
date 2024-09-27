import React from "react";
import ReactNative, { StyleSheet, View, Text } from "react-native";
import Track from "@/components/Track";
import type { Album } from "@/types/library";
import Feather from '@expo/vector-icons/Feather';

const styles = StyleSheet.create({
    container: {
        padding: 5,
        borderWidth: 3,
        borderColor: "#aaa",
        borderRadius: 5
    },
    tracklist: {}
});

type Props = {
    title: string,
    album: Album,
    style?: ReactNative.ViewStyle
};

export default function Album({ title, album, style }: Props): React.ReactNode {
    return (
        <View style={{ ...styles.container, ...style }}>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
                <Feather name="disc" size={ 50 } color="black" style={{ marginRight: 20 }} />
                <View style={{  }}>
                    <Text style={{ fontSize: 25, fontWeight: "bold" }}>{ title }</Text>
                    <Text style={{ color: "#222" }}>{ album.album_artist || "Unknown Artist" }</Text>
                </View>
            </View>
            <View style={ styles.tracklist }>
                { album.tracks.map((t, i) => <Track track={ t } index={ i } key={ i } />) }
            </View>
        </View>
    );
}
