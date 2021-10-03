import { useRef, memo } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, LinearProgress,
} from "@mui/material";
import { dequal as isEqual } from "dequal";
import { useCustomCompareEffect as useDeepEffect } from "use-custom-compare";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import { useTableStore, StoreProvider } from "../store";
import { ExportCSV, MinMaxFont, Refresh } from "../toolbar";
import { DataTableProps } from "../typings";
import { VirtualRow } from "./row";

const MuiDataTable = memo((props: DataTableProps) => {
    const { columns, rows, component, loading, sx, overscanCount = 0, truncateText } = props;

    const { rows: sortedRows, sortBy, sortDirection } = useTableStore(store => store.state);

    const {
        setOrgRows,
        setRows: setSortedRows,
        setSortBy,
        setSortDirection,
    } = useTableStore(store => store.actions);

    const virtuoso = useRef<VirtuosoHandle>(null);

    // on rows prop change, change our rows
    useDeepEffect(
        () => {
            setSortedRows(rows);
            setOrgRows(rows);
        },
        [rows],
        isEqual
    );

    const sortRows = (dir: boolean, field: string) => {
        const sortFn = () => {
            if (dir) {
                return [...rows].sort((a, b) =>
                    `${a[field]}`.localeCompare(`${b[field]}`)
                );
            }
            return [...rows].sort((a, b) =>
                `${b[field]}`.localeCompare(`${a[field]}`)
            );
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
                    width: "100%",
                    height: "100%",
                    ...sx,
                }}
                component="div"
            >
                <TableHead component="div">
                    <TableRow sx={{ display: "flex" }} component="div">
                        {columns.map(({ field, flex, width, headerName }) => (
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
                                        {String(headerName)}
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
}, isEqual);

function Toolbar() {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: "5px",
            }}
        >
            <ExportCSV />
            <MinMaxFont />
            <Refresh />
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

// entry point to the data table component
export default function TableEntry({ ...props }: DataTableProps) {
    return (
        <StoreProvider>
            <MuiDataTable {...props} />
        </StoreProvider>
    );
}
