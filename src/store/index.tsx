import create from "zustand";
import createContext, { UseContextStore } from "zustand/context";

import { immer } from "./middleware";
import { Row } from "../typings";

export interface GridStore {
    state: {
        rows: Row[];
        orgRows: Row[];
        fontSize: number;
        sortDirection: boolean;
        sortBy: string;
    };
    actions: {
        setFontSize: (fn: (size: number) => number) => void;
        setSortDirection: () => void;
        setSortBy: (by: string) => void;
        setRows: (rows: Row[]) => void;
        setOrgRows: (rows: Row[]) => void;
    };
}

const { Provider, useStore, useStoreApi } = createContext();

const gridStore = () =>
    create<GridStore>(
        immer(set => ({
            state: {
                rows: [],
                orgRows: [],
                fontSize: 1,

                sortDirection: false,
                sortBy: "",
            },
            actions: {
                setFontSize: fn =>
                    set(store => {
                        store.state.fontSize = fn(store.state.fontSize);
                    }),
                setSortDirection: () =>
                    set(store => {
                        store.state.sortDirection = !store.state.sortDirection;
                    }),
                setSortBy: by =>
                    set(store => {
                        store.state.sortBy = by;
                    }),
                setRows: rows =>
                    set(store => {
                        store.state.rows = rows;
                    }),
                setOrgRows: rows =>
                    set(store => {
                        store.state.orgRows = rows;
                    }),
            },
        }))
    );

export function StoreProvider({ children }: any) {
    return <Provider createStore={gridStore as any}>{children}</Provider>;
}

export const useGridStore = useStore as UseContextStore<GridStore>;
export const useGridStoreAPI = useStoreApi;
