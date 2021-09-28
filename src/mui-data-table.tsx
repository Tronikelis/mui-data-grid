import { memo, useRef } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, LinearProgress,
} from "@mui/material";
import { dequal as isEqual } from "dequal";
import { useCustomCompareEffect as useDeepEffect } from "use-custom-compare";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { useWorker } from "@koale/useworker";

import { useTableStore } from "./store";
import { TruncateText } from "./helpers";
import { MinMaxFont } from "./toolbar";
import { DataTableProps, VirtualRowProps, RenderCell, Row } from "./typings";

const workerSortFn = (rows: Row[], field: string, dir: boolean) => {
    if (dir) {
        return [...rows].sort((a, b) => {
            if ((a[field] as any) < (b[field] as any)) return -1;
            if ((b[field] as any) < (a[field] as any)) return 1;
            return 0;
        });
    }
    return [...rows].sort((a, b) => {
        if ((a[field] as any) < (b[field] as any)) return 1;
        if ((b[field] as any) < (a[field] as any)) return -1;
        return 0;
    });
};

export default function MuiDataTable(props: DataTableProps) {
    // table props
    const { columns, rows, component, loading, sx, overscanCount = 0, truncateText } = props;

    const {
        // our sorted rows
        rows: sortedRows,
        // field that is sorted by
        sortBy,
        // sort direction -> true up, false down
        sortDirection,
    } = useTableStore(store => store.state);

    const {
        setRows: setSortedRows,
        setSortBy,
        setSortDirection,
    } = useTableStore(store => store.actions);

    // web worker for sorting
    const [sortWorker, { status: workerStatus }] = useWorker(workerSortFn);

    // virtuoso ref
    const virtuoso = useRef<VirtuosoHandle>(null);

    // on rows prop change, change our rows
    useDeepEffect(
        () => {
            setSortedRows(rows);
        },
        [rows],
        isEqual
    );

    const sortRows = async (dir: boolean, field: string) => {
        if (workerStatus === "RUNNING") return;
        
        // scroll to top
        virtuoso.current?.scrollToIndex({ index: 0 });
        // set currently sorted by column
        setSortBy(field);
        // sort the things, using a web worker
        setSortedRows(await sortWorker(sortedRows, field, dir));
    };

    return (
        <TableContainer
            component={component ?? "div"}
            sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Toolbar />

            <Table
                sx={{
                    minWidth: "300px",
                    display: "flex",
                    flexDirection: "column",
                    ...sx,
                }}
                component="div"
            >
                <TableHead component="div">
                    <TableRow sx={{ display: "flex" }} component="div">
                        {columns.map(({ field, flex, width }) => (
                            <TableCell
                                key={field}
                                sx={{
                                    flex: !width && !flex ? 1 : flex,
                                    width,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                                component="div"
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        width: "100%",
                                    }}
                                >
                                    <TableSortLabel
                                        active={sortBy === field}
                                        direction={sortDirection ? "asc" : "desc"}
                                        onClick={() => {
                                            sortRows(!sortDirection, field);
                                            setSortDirection();
                                        }}
                                    >
                                        {field.toString()}
                                    </TableSortLabel>
                                </Box>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                {/** virtualized rows */}
                <TableBody
                    sx={{ width: "100%", height: "100%", position: "relative" }}
                    component="div"
                >
                    {loading && <LoadingOverlay />}
                    <Virtuoso
                        height="100%"
                        width="100%"
                        ref={virtuoso}
                        data={sortedRows}
                        overscan={overscanCount}
                        itemContent={(index, row) => (
                            <VirtualRow
                                columns={columns}
                                row={row}
                                index={index}
                                truncate={truncateText}
                            />
                        )}
                    />
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function Toolbar() {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
            }}
        >
            <MinMaxFont />
        </Box>
    );
}

const VirtualRow = memo((props: VirtualRowProps) => {
    const { columns, row, index, truncate } = props;

    // current font size
    const fontSize = useTableStore(store => store.state.fontSize);

    const renderField = (field: string, renderCell?: RenderCell) => {
        if (renderCell) {
            return (
                <>
                    {renderCell({
                        index,
                        data: row?.[field] ?? "",
                    })}
                </>
            );
        }
        return row?.[field]?.toString();
    };

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <TableRow sx={{ display: "flex" }} component="div" hover>
                {columns.map(({ field, flex, width, renderCell }, i) => (
                    <TableCell
                        component="div"
                        key={i}
                        sx={{
                            flex: !width && !flex ? 1 : flex,
                            width,
                            wordBreak: "break-word",
                        }}
                    >
                        <div style={{ fontSize: `${fontSize}em` }}>
                            {!!truncate ? (
                                <TruncateText
                                    obj={renderField(field, renderCell)}
                                    {...truncate}
                                />
                            ) : (
                                <>{renderField(field, renderCell)}</>
                            )}
                        </div>
                    </TableCell>
                ))}
            </TableRow>
        </div>
    );
});

function LoadingOverlay() {
    return (
        <LinearProgress
            sx={{
                position: "absolute",
                top: "0px",
                width: "100%",
            }}
        />
    );
}
