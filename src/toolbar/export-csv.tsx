import { useEffect, useRef } from "react";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { Box, Button } from "@mui/material";
import { CSVLink } from "react-csv";

import { useGridStoreAPI, GridStore } from "../store";

export default function ExportCSV() {
    const { getState, subscribe } = useGridStoreAPI();

    const dataRef = useRef((getState() as GridStore).state.rows);

    useEffect(
        () =>
            // eslint-disable-next-line react-hooks/rules-of-hooks
            subscribe((store: GridStore) => (dataRef.current = store.state.rows)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <Box>
            <CSVLink
                data={dataRef.current}
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
