import { CSSProperties, useEffect, useState } from "react";

const isString = (x: any) => Object.prototype.toString.call(x) === "[object String]";

interface TruncateTextProps {
    obj: any;
    length?: number;
    moreText?: string;
    lessText?: string;
}

const MoreLessStyle = {
    cursor: "pointer",
    color: "#1b4394",
    fontWeight: "bold",
} as CSSProperties;

export function TruncateText(props: TruncateTextProps) {
    const { length = 30, obj, lessText = "Less", moreText = "More" } = props;

    const [value, setValue] = useState("");
    const [truncated, setTruncated] = useState(true);

    useEffect(() => {
        isString(obj) && setValue(obj);
    }, [obj]);

    const changeTruncate = () => {
        setTruncated(x => !x);
    };

    // fallback if not a string
    if (!value) return obj as JSX.Element;

    return (
        <>
            {truncated ? (
                <>
                    {value.substring(0, truncated ? length : value.length)}
                    {"... "}
                    <span onClick={changeTruncate} style={MoreLessStyle}>
                        {moreText}
                    </span>
                </>
            ) : (
                <>
                    {value}{" "}
                    <span onClick={changeTruncate} style={MoreLessStyle}>
                        {lessText}
                    </span>
                </>
            )}
        </>
    );
}
