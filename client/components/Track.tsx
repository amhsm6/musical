import React from "react";
import { Text } from "react-native";
import type { Track } from "@/types/library";

type Props = { track: Track };

export default function Track({ track }: Props): React.ReactNode {
    return (
        <Text>
            { track.title }
        </Text>
    )
}
