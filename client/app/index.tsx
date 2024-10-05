import React, { useState } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { QueueProvider } from "@/contexts/queue";
import SearchBar from "@/components/SearchBar";
import Library from "@/components/Library";
import Queue from "@/components/Queue";
import Player from "@/components/Player";

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get("window").height,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    left: {
        width: "60%",
        alignItems: "center"
    },
    searchbar: {
        width: "90%",
        marginTop: 20,
        marginBottom: 20
    },
    library: {
        width: "90%",
        height: "90%"
    },
    right: {
        width: "35%",
        marginRight: "4%",
        justifyContent: "space-between"
    },
    queue: {
        height: "70%",
        marginTop: 15
    },
    player: {
        marginBottom: 30
    }
});

// FIXME: mobile layout

export default function Index(): React.ReactNode {
    const [query, setQuery] = useState<string>("");

    return (
        <QueueProvider>
            <View style={ styles.container }>
                <View style={ styles.left }>
                    <SearchBar query={ query } setQuery={ setQuery } style={ styles.searchbar } />
                    <Library query={ query } style={ styles.library } />
                </View>
                <View style={ styles.right }>
                    <Queue style={ styles.queue } />
                    <Player style={ styles.player } />
                </View>
            </View>
        </QueueProvider>
    );
}
