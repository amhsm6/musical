import React, { useEffect, useRef } from "react";
import ReactNative, { Pressable, ScrollView, Text } from "react-native";

type Props = {
    children: React.ReactNode,
    style?: ReactNative.TextStyle
};

export default function ScrollingText({ children, style }: Props): React.ReactNode {
    const scrolling = useRef<boolean>(false);
    const offset = useRef<number>(0);

    const ref = useRef<ScrollView>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!ref.current) { return; }

            if (!scrolling.current) {
                offset.current = 0;
                ref.current.scrollTo({ x: offset.current, y: 0, animated: true })
                return;
            }

            ref.current.scrollTo({ x: offset.current, y: 0, animated: true })
            offset.current = (offset.current + 3) % 500;
        }, 5);

        return () => clearInterval(interval);
    }, []);

    return (
        <Pressable onHoverIn={ () => scrolling.current = true } onHoverOut={ () => scrolling.current = false }>
            <ScrollView
                ref={ ref }
                horizontal={ true }
                showsHorizontalScrollIndicator={ false }
                style={{ width: style?.width }}
            >
                <Text numberOfLines={ 1 } style={ style }>{ children }</Text>
            </ScrollView>
         </Pressable>
    );
}
