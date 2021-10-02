import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useTableStore } from "../store";

export default function Refresh() {
    const { setSortBy, setSortDirection, setRows } = useTableStore(store => store.actions);
    // TODO set everything to default
    return (
        <IconButton>
            <RefreshIcon />
        </IconButton>
    );
}
