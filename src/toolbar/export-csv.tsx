import ImportExportIcon from "@mui/icons-material/ImportExport";
import { Box, Button } from "@mui/material";
import { CSVLink } from "react-csv";

import { useGridStore } from "../store";

export default function ExportCSV() {
    const rows = useGridStore(store => store.state.rows);
    return (
        <Box>
            <CSVLink
                data={rows}
                filename="data-table-export"
                style={{ textDecoration: "none" }}
            >
                <Button variant="text" endIcon={<ImportExportIcon />} color="primary">
                    Export
                </Button>
            </CSVLink>
        </Box>
    );
}
