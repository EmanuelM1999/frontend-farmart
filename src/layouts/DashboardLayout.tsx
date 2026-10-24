
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                minHeight: "100vh",
                bgcolor: "background.default",
            }}
        >
            {/* Menú lateral */}
            <Sidebar />

            {/* Contenido principal */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    minHeight: "100vh",
                    p: 3,
                    bgcolor: "background.default",
                    color: "text.primary",
                }}
            >
                {/* Aquí se renderiza la página seleccionada */}
                <Outlet />
            </Box>
        </Box>
    );
}
