import create from "zustand";
import produce from "immer";

import { Row } from "../typings";

interface TableStore {
    state: {
        rows: Row[];
        fontSize: number;
        sortDirection: boolean;
        sortBy: string;
    };
    actions: {
        incrementFont: () => void;
        decrementFont: () => void;
        setSortDirection: () => void;
        setSortBy: (by: string) => void;
        setRows: (rows: Row[]) => void;
    };
}

export const useTableStore = create<TableStore>(set => ({
    state: {
        rows: [],
        fontSize: 1,

        sortDirection: false,
        sortBy: "",
    },
    actions: {
        incrementFont: () =>
            set(
                produce((clone: TableStore) => {
                    clone.state.fontSize += 0.1;
                })
            ),
        decrementFont: () =>
            set(
                produce((clone: TableStore) => {
                    clone.state.fontSize -= 0.1;
                })
            ),
        setSortDirection: () =>
            set(
                produce((clone: TableStore) => {
                    clone.state.sortDirection = !clone.state.sortDirection;
                })
            ),
        setSortBy: by =>
            set(
                produce((clone: TableStore) => {
                    clone.state.sortBy = by;
                })
            ),
        setRows: rows =>
            set(
                produce((clone: TableStore) => {
                    clone.state.rows = rows;
                })
            ),
    },
}));
