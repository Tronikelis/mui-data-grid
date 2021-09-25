import { memo, useRef, useState } from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, LinearProgress,
} from "@mui/material";
import { sort } from "fast-sort";
import { dequal as isEqual } from "dequal";
import { useCustomCompareEffect as useDeepEffect } from "use-custom-compare";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import { DataTableProps, VirtualRowProps, RenderCell } from "../types";

export default function MuiDataTable(props: DataTableProps) {
    // table props
    const {
        columns,
        rows,
        component,
        loading,
        sx,
        overscanCount = 0,
        truncateText = true,
    } = props;

    // true -> up, false -> down
    const [sortDirection, setSortDirection] = useState(false);
    // sort by -> field name
    const [sortBy, setSortBy] = useState("");
    // currently sorted rows
    const [sortedRows, setSortedRows] = useState(rows);

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

    const sortRows = (dir: boolean, field: string) => {
        // scroll to top
        virtuoso.current?.scrollToIndex({ index: 0 });
        // set currently sorted by column
        setSortBy(field);
        // sort the things
        setSortedRows(rows => {
            if (dir) {
                return sort(rows).asc(x => x[field]);
            }
            return sort(rows).desc(x => x[field]);
        });
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
                                            setSortDirection(x => !x);
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

const VirtualRow = memo((props: VirtualRowProps) => {
    const { columns, row, index, truncate } = props;

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
                        {renderField(field, renderCell)}
                    </TableCell>
                ))}
            </TableRow>
        </div>
    );
});
