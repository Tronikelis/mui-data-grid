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
import { createNewSortInstance } from "fast-sort";

// natural sort
const naturalSort = createNewSortInstance({
    comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: "base" }).compare,
});

const fwh = {
    width: "100%",
    height: "100%",
};

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
                return naturalSort(rows).asc(x => x[field]);
            }
            return naturalSort(rows).desc(x => x[field]);
        };

        setSortBy(field);
        setSortedRows(sortFn());
        // scroll to top
        virtuoso.current?.scrollToIndex({ index: 0 });
    };

    return (
        <Box
            component={component ?? "div"}
            sx={{ ...fwh, display: "flex", flexDirection: "column" }}
        >
            <Toolbar />

            <TableContainer sx={fwh} component={component ?? "div"}>
                <Table
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        ...fwh,
                        ...sx,
                    }}
                    component="div"
                >
                    <Box
                        sx={{
                            ...fwh,
                            minWidth: "max-content",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <TableHead component="div">
                            <TableRow sx={{ display: "flex" }} component="div">
                                {columns.map(({ field, flex, width, headerName }) => (
                                    <TableCell
                                        key={field}
                                        sx={{
                                            flex: !width && !flex ? 1 : flex,
                                            width,
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                        }}
                                        component="div"
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
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        {/** virtualized rows */}
                        <TableBody sx={{ ...fwh, position: "relative" }} component="div">
                            {loading && <LoadingOverlay />}
                            <Virtuoso
                                height="100%"
                                width="100%"
                                ref={virtuoso}
                                // if rows have been changed, then fallback to original
                                // while the sortedRows get applied
                                data={rows.length !== sortedRows.length ? rows : sortedRows}
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
                    </Box>
                </Table>
            </TableContainer>
        </Box>
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
