import React from "react";
import ReactNative, { StyleSheet, View, Text } from "react-native";
import Track from "@/components/Track";
import type { Album } from "@/types/library";

const styles = StyleSheet.create({
    container: {
        padding: 3,
        flexDirection: "column",
        borderWidth: 3,
        borderColor: "#aaa",
        borderRadius: 5
    },
    albumDesc: {},
    albumTitle: {
        fontSize: 25
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
            <View style={ styles.albumDesc }>
                <Text style={ styles.albumTitle }>{ title }</Text>
            </View>
            <View style={ styles.tracklist }>
                { album.tracks.map((t, i) => <Track track={ t } key={ i } />) }
            </View>
        </View>
    );
}
