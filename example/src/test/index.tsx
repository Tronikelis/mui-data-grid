import { useState } from "react";
import { Button, CssBaseline, Dialog, Paper } from "@mui/material";

import { MuiDataGrid, Row } from "mui-data-grid";

const def = Array(10_000)
    .fill(0)
    .map((val, index) => ({
        hello: null as any,
        world: "hi " + Math.random().toFixed(Math.floor(Math.random() * 100)),
        another: "hi " + Math.random().toFixed(Math.floor(Math.random() * 100)),
        other: "hi " + Math.random().toFixed(Math.floor(Math.random() * 100)),
    })) as Row[];

function cell({ value, row }: any) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>Open</Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <div>Heelloo, {JSON.stringify({ value, row })}</div>
            </Dialog>
        </>
    );
}

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
                    <MuiDataGrid
                        columns={[
                            {
                                field: "hello",
                                headerName: "Heelo",
                                flex: 0.2,
                            },
                            {
                                field: "world",
                                headerName: "World",
                                flex: 1,
                            },
                            {
                                field: "another",
                                headerName: "Another",
                                flex: 1,
                            },
                            {
                                field: "other",
                                headerName: "Other",
                                flex: 1,
                            },
                            {
                                field: "AA",
                                headerName: "NAH",
                                flex: 1,
                            },
                        ]}
                        rows={rows}
                        component={Paper}
                        loading={loading}
                        truncateText={{
                            lines: 3,
                            lessText: "Less",
                            moreText: "More",
                        }}
                    />
                </div>
            </div>
        </>
    );
}
