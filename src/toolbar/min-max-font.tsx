import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { useTableStore } from "../store";

export default function MinMaxFont() {
    // for changing font's size
    const { incrementFont, decrementFont } = useTableStore(store => store.actions);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
            }}
        >
            <IconButton onClick={incrementFont}>
                <AddIcon />
            </IconButton>
            <IconButton onClick={decrementFont}>
                <RemoveIcon />
            </IconButton>
        </Box>
    );
}
