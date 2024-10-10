import React, { useContext, useEffect, useRef } from "react";
import ReactNative, { View, Text, FlatList, Pressable } from "react-native";
import QueueContext from "@/contexts/queue";
import QueueItem from "@/components/QueueItem";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";

type Props = { style?: ReactNative.ViewStyle };

export default function Queue({ style }: Props): React.ReactNode {
    const { state, dispatch } = useContext(QueueContext);
    const playid = state.playing_index;

    const ref = useRef<FlatList>(null);

    const item = playid != null ? state.queue[playid].id : -1;
    useEffect(() => {
        if (!ref.current || playid === null) { return; }

        ref.current.scrollToIndex({ index: playid > 1 ? playid - 2 : 0, animated: false });
    }, [item, playid]);

    return (
        <View style={ style }>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>Play Queue</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginRight: 20 }}>
                    <Pressable onPress={ () => dispatch({ type: "shuffle" }) } style={{ marginRight: 20 }}>
                        <Entypo name="shuffle" size={ 32 } style={{ paddingTop: 5 }} />
                    </Pressable>
                    <Pressable onPress={ () => dispatch({ type: "clear" }) }>
                        <FontAwesome name="trash" size={ 32 } />
                    </Pressable>
                </View>
            </View>
            <FlatList
                ref={ ref }
                data={ state.queue }
                keyExtractor={ (_, index) => index.toString() }
                renderItem={ ({ item, index }) => <QueueItem track={ item } playing={ playid === index } index={ index } /> }
                style={{ marginTop: 20, paddingRight: 30 }}
            />
        </View>
    );
}
