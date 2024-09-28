import React, { useState } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { QueueProvider } from "@/contexts/queue";
import SearchBar from "@/components/SearchBar";
import Library from "@/components/Library";
import Queue from "@/components/Queue";

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        marginLeft: 30
    },
    searchbar: {
        width: "60%",
        marginTop: 20,
        marginBottom: 20
    },
    library: {
        width: "60%",
        height: Dimensions.get("window").height - 70
    },
    queue: {
        position: "absolute",
        top: 20,
        right: 20,
        width: "35%",
        height: "90%"
    }
});

export default function Index(): React.ReactNode {
    const [query, setQuery] = useState<string>("");

    return (
        <QueueProvider>
            <View style={ styles.container }>
                <SearchBar query={ query } setQuery={ setQuery } style={ styles.searchbar } />
                <Library query={ query } style={ styles.library } />
                <Queue style={ styles.queue } />
            </View>
        </QueueProvider>
    );
}
