import React, { useState } from "react";
import { StyleSheet, Dimensions, View, Text } from "react-native";
import { QueueProvider } from "@/contexts/queue";
import SearchBar from "@/components/SearchBar";
import Library from "@/components/Library";

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center"
    },
    searchbar: {
        width: "60%",
        marginTop: 20,
        marginBottom: 20
    },
    library: {
        width: "60%",
        height: Dimensions.get("window").height - 70
    }
});

export default function Index(): React.ReactNode {
    const [query, setQuery] = useState<string>("");

    return (
        <QueueProvider>
            <View style={ styles.container }>
                <SearchBar query={ query } setQuery={ setQuery } style={ styles.searchbar } />
                <Library query={ query } style={ styles.library } />
            </View>
        </QueueProvider>
    );
}
