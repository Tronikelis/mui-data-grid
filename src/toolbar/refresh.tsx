import { IconButton } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { GridStore, useGridStore, useGridStoreAPI } from "../store";

export default function Refresh() {
    const { setSortBy, setRows, setFontSize } = useGridStore(store => store.actions);
    const { getState } = useGridStoreAPI();

    const refresh = () => {
        setSortBy("");
        setFontSize(() => 1);

        const orgRows = (getState() as GridStore).state.orgRows;
        if (!orgRows || orgRows.length < 1) return;
        setRows(orgRows);
    };

    return (
        <IconButton onClick={refresh}>
            <RestartAltIcon />
        </IconButton>
    );
}
