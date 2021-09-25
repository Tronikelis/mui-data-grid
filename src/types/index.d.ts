import { SxProps } from "@mui/system";
import { ElementType, Element } from "react";

/**
 * keys = field names
 * values = field values
 */
export interface Row {
    [key: string]: string;
}

export interface Column {
    field: string;
    width?: number;
    flex?: number;
    renderCell?: RenderCell;
}

export type RenderCell = (args: { index: number; data: string }) => ReactNode;

export interface DataTableProps {
    /**
     * the table rows
     */
    rows: Row[];
    /**
     * the table columns
     */
    columns: Column[];
    /**
     * new styling option from mui 5v
     */
    sx?: SxProps;
    /**
     * root component for the table
     */
    component?: ElementType<any>;
    /**
     * how many (currently invisible) rows to render in advance
     * can reduce white space when scrolling, but usually leave
     * it at default which is 0
     */
    overscanCount?: number;
    /**
     * is the table currently loading?
     * displays a loading spinner if true
     */
    loading?: boolean;
    /**
     * if true, make the the shorter and show button "more",
     * to show full original text. Default true
     */
    truncateText?: boolean;
}

export interface VirtualRowProps {
    row: Row;
    columns: Column[];
    index: number;
    truncate: boolean;
}

export interface VirtualDynamicListProps {
    sortedRows: Row[];
    columns: Column[];
    overscanCount: number;
}

export function DataTable(props: DataTableProps): Element;
