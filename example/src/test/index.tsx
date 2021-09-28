import { useState } from "react";
import { CssBaseline, Paper } from "@mui/material";

import { MuiDataTable, Row } from "mui-data-table";

const def = Array(1_000)
    .fill(0)
    .map((val, index) => ({
        hello: "hi " + Math.random().toFixed(4),
        world: "hi " + Math.random().toFixed(4),
        another: "hi " + Math.random().toFixed(4),
        other: "hi " + Math.random().toFixed(4),
    })) as Row[];

export default function Test() {
    const [count, setCount] = useState(0);
    const [rows, setRows] = useState(def);
    const [loading, setLoading] = useState(false);

    const startLoading = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 3000);
    };

    return (
        <>
            <CssBaseline />
            <div
                style={{
                    width: "60vw",
                    height: "60vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <button onClick={startLoading}>start loading</button>
                <button onClick={() => setRows([])}>clear</button>
                <button onClick={() => setCount(x => x + 1)}>
                    {count}
                    re-render
                </button>

                <div style={{ height: "100%", width: "100%" }}>
                    <MuiDataTable
                        columns={[
                            {
                                field: "hello",
                                flex: 0.2,
                            },
                            {
                                field: "world",
                                flex: 1,
                            },
                            {
                                field: "another",
                                width: 200,
                            },
                            {
                                field: "other",
                                flex: 1,
                            },
                        ]}
                        rows={rows}
                        sx={{
                            width: "100%",
                            height: "100%",
                        }}
                        component={Paper}
                        loading={loading}
                        truncateText={{
                            length: 60,
                            lessText: "Less",
                            moreText: "More",
                        }}
                    />
                </div>
            </div>
        </>
    );
}
