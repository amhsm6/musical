import React, { useState, useEffect, useRef } from "react";
import ReactNative, { Pressable, ScrollView, Text } from "react-native";

type Props = {
    children: React.ReactNode,
    style?: ReactNative.TextStyle
};

export default function ScrollingText({ children, style }: Props): React.ReactNode {
    const [textWidth, setTextWidth] = useState<number>(0);

    const scrolling = useRef<boolean>(false);
    const offset = useRef<number>(0);

    const viewRef = useRef<ScrollView>(null);
    const textRef = useRef<Text>(null);

    useEffect(() => {
        if (!textRef.current) { return; }
        textRef.current.measure((x, y, width) => { setTextWidth(width); });
    });

    useEffect(() => {
        const interval = setInterval(() => { // FIXME: performance issue, rewrite so that intervals are created only when scrolling is active
            if (!viewRef.current) { return; }

            if (!scrolling.current) {
                viewRef.current.scrollTo({ x: 0, y: 0, animated: true })
                offset.current = 0;
                return;
            }

            viewRef.current.scrollTo({ x: offset.current, y: 0, animated: true })
            offset.current = offset.current < textWidth ? offset.current + 3 : textWidth;
        }, 5);

        return () => clearInterval(interval);
    }, [textWidth]);

    return (
        <Pressable
            onHoverIn={ () => scrolling.current = true }
            onHoverOut={ () => scrolling.current = false }
            onPressIn={ () => scrolling.current = true }
            onPressOut={ () => scrolling.current = true }
        >
            <ScrollView
                ref={ viewRef }
                horizontal={ true }
                showsHorizontalScrollIndicator={ false }
                style={{ cursor: "auto" }}
            >
                <Text ref={ textRef } numberOfLines={ 1 } style={ style }>{ children }</Text>
            </ScrollView>
         </Pressable>
    );
}
