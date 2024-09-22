import React from "react";
import ReactNative, { StyleSheet, View, TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const styles = StyleSheet.create({
    searchbar: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 3,
        borderWidth: 3,
        borderColor: "black",
        borderRadius: 5
    },
    input: {
        width: "100%",
        marginLeft: 10
    }
});

type Props = {
    query: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
    style?: ReactNative.ViewStyle
};

export default function SearchBar({ query, setQuery, style }: Props): React.ReactNode {
    return (
        <View style={{ ...styles.searchbar, ...style }}>
            <AntDesign name="search1" style={{ marginLeft: 10 }} size={ 15 } />
            <TextInput
                value={ query }
                onChangeText={ setQuery }
                style={ styles.input }
                placeholder="Search..."
            />
        </View>
    );
}
