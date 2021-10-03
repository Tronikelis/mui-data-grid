import { IconButton } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { useTableStore } from "../store";

export default function Refresh() {
    const { setSortBy, setRows, setFontSize } = useTableStore(store => store.actions);

    const refresh = () => {
        setSortBy("");
        setFontSize(() => 1);


        // TODO
        // if (!cachedRows) return;
        // setRows(cachedRows);
    };

    return (
        <IconButton onClick={refresh}>
            <RestartAltIcon />
        </IconButton>
    );
}
