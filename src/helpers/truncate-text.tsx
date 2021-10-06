import { CSSProperties, useEffect, useState, useCallback } from "react";

import { isString } from ".";

interface TruncateTextProps {
    obj: any;
    lines?: number;
    moreText?: string;
    lessText?: string;
}

const MoreLessStyle = {
    cursor: "pointer",
    color: "#1b4394",
} as CSSProperties;

export function TruncateText(props: TruncateTextProps) {
    const { lines = 3, obj, lessText = "Less", moreText = "More" } = props;

    const [value, setValue] = useState("");
    const [truncated, setTruncated] = useState(true);
    const [length, setLength] = useState<null | number>(null);

    // calculate text's length
    const textRef = useCallback(
        (node: HTMLSpanElement | null) => {
            if (!node) {
                setLength(null);
                return;
            }
            // calculate if there are more new lines than the maximum
            const breaks = node.getClientRects().length;
            if (breaks <= lines) {
                setLength(null);
                return;
            }

            setLength(Math.ceil(node.innerText.length / lines));
        },
        [lines]
    );

    useEffect(() => {
        isString(obj) && setValue(obj);
        return () => setLength(null);
    }, [obj]);

    // fallback if not a string
    if (!value) return obj as JSX.Element;

    return (
        <span ref={textRef}>
            {truncated && length ? value.substring(0, length) : value}

            <span onClick={() => setTruncated(x => !x)} style={MoreLessStyle}>
                {length && <>{truncated ? "... " + moreText : " " + lessText}</>}
            </span>
        </span>
    );
}
