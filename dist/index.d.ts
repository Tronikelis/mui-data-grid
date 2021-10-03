import { SxProps } from '@mui/system';
import { ReactNode, ElementType } from 'react';

/**
 * keys = field names
 * values = field values
 */
interface Row {
    [key: string]: string | number;
}

interface Column {
    field: string;
    headerName: string;
    width?: number;
    flex?: number;
    renderCell?: RenderCell;
}

type RenderCell = (args: { index: number; value: any; row: Row }) => ReactNode;

interface DataTableProps {
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
    truncateText?: TruncateText;
}

interface TruncateText {
    lines?: number;
    lessText?: string;
    moreText?: string;
}

interface VirtualRowProps {
    row: Row;
    columns: Column[];
    index: number;
    truncate?: TruncateText;
}

interface VirtualDynamicListProps {
    sortedRows: Row[];
    columns: Column[];
    overscanCount: number;
}

declare function MuiDataTable(props: DataTableProps): JSX.Element;

export { Column, DataTableProps, MuiDataTable, RenderCell, Row, VirtualDynamicListProps, VirtualRowProps };
