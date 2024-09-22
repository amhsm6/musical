import React, { useState } from "react";
import { StyleSheet, View  } from "react-native";
import SearchBar from "@/components/SearchBar";
import Library from "@/components/Library";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    searchbar: {
        width: "60%",
        marginTop: 20
    }
});

export default function Index(): React.ReactNode {
    const [query, setQuery] = useState<string>("");

    return (
        <View style={ styles.container }>
            <SearchBar query={ query } setQuery={ setQuery } style={ styles.searchbar } />
            <Library query={ query } />
        </View>
    );
}
