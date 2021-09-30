import { useRef } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, LinearProgress,
} from "@mui/material";
import { dequal as isEqual } from "dequal";
import { useCustomCompareEffect as useDeepEffect } from "use-custom-compare";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import { useTableStore } from "../store";
import { MinMaxFont } from "../toolbar";
import { DataTableProps } from "../typings";
import { VirtualRow } from "./row";

export default function MuiDataTable(props: DataTableProps) {
    const { columns, rows, component, loading, sx, overscanCount = 0, truncateText } = props;

    const {
        rows: sortedRows,
        sortBy,
        sortDirection,
    } = useTableStore(store => store.state);

    const {
        setRows: setSortedRows,
        setSortBy,
        setSortDirection,
    } = useTableStore(store => store.actions);

    const virtuoso = useRef<VirtuosoHandle>(null);

    // on rows prop change, change our rows
    useDeepEffect(
        () => {
            setSortedRows(rows);
        },
        [rows],
        isEqual
    );

    const sortRows = (dir: boolean, field: string) => {
        const sortFn = () => {
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

        setSortBy(field);
        setSortedRows(sortFn());
        // scroll to top
        virtuoso.current?.scrollToIndex({ index: 0 });
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
