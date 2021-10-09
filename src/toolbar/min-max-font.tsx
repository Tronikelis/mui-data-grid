import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { useGridStore } from "../store";

export default function MinMaxFont() {
    const { setFontSize } = useGridStore(store => store.actions);

    const incrementFont = () => {
        setFontSize(x => x + 0.1);
    };
    const decrementFont = () => {
        setFontSize(x => x - 0.1);
    };

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
