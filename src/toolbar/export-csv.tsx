import { useEffect, useRef } from "react";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { Box, Button } from "@mui/material";
import { CSVLink } from "react-csv";

import { useTableStore } from "../store";

export default function ExportCSV() {
    const dataRef = useRef(useTableStore.getState().state.rows);

    useEffect(
        () => useTableStore.subscribe(store => (dataRef.current = store.state.rows)),
        []
    );

    return (
        <Box>
            <CSVLink
                data={dataRef.current}
                filename="data-table-export"
                style={{ textDecoration: "none" }}
            >
                <Button
                    variant="text"
                    endIcon={<ImportExportIcon />}
                    color="primary"
                >
                    Export
                </Button>
            </CSVLink>
        </Box>
    );
}
