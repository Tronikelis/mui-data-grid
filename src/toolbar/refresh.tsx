import { IconButton } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { TableStore, useTableStore, useTableStoreAPI } from "../store";

export default function Refresh() {
    const { setSortBy, setRows, setFontSize } = useTableStore(store => store.actions);
    const { getState } = useTableStoreAPI();

    const refresh = () => {
        setSortBy("");
        setFontSize(() => 1);

        const orgRows = (getState() as TableStore).state.orgRows;
        if (!orgRows || orgRows.length < 1) return;
        setRows(orgRows);
    };

    return (
        <IconButton onClick={refresh}>
            <RestartAltIcon />
        </IconButton>
    );
}
