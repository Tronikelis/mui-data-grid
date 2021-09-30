import create from "zustand";

import { immer } from "./middleware";
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

export const useTableStore = create<TableStore>(immer(set => ({
    state: {
        rows: [],
        fontSize: 1,

        sortDirection: false,
        sortBy: "",
    },
    actions: {
        incrementFont: () => set(store => {
            store.state.fontSize += 0.1;
        }),
        decrementFont: () => set(store => {
            store.state.fontSize -= 0.1;
        }),
        setSortDirection: () => set(store => {
            store.state.sortDirection = !store.state.sortDirection;
        }),
        setSortBy: by => set(store => {
            store.state.sortBy = by;
        }),
        setRows: rows => set(store => {
            store.state.rows = rows;
        }),
    },
})));
