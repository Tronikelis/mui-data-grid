import { IconButton } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';

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
            <VisibilityIcon />
        </IconButton>
    );
}
