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
        setFontSize: (fn: (size: number) => number) => void;
        setSortDirection: () => void;
        setSortBy: (by: string) => void;
        setRows: (rows: Row[]) => void;
    };
}

export const useTableStore = create<TableStore>(
    immer(set => ({
        state: {
            rows: [],
            fontSize: 1,

            sortDirection: false,
            sortBy: "",
        },
        actions: {
            setFontSize: fn => set(store => {
                store.state.fontSize = fn(store.state.fontSize);
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
    })
));
