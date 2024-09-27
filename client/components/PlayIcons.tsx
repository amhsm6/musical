import React from "react";
import { View } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

type Props = {
    size: number
}

export function Play({ size }: Props): React.ReactNode {
    return <FontAwesome5 name="play" size={ size } color="black" />;
}

export function PlayNext({ size }: Props): React.ReactNode {
    return (
        <View>
            <FontAwesome5 name="play" size={ size } color="black" />
            <FontAwesome6 name="plus" size={ size / 2 } color="white" style={{ position: "absolute", left: size / 8, top: size / 3.5 }} />
        </View>
    )
}
