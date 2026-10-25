import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                width: "100%",
            }}
        >
            <Sidebar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: 0,
                    minWidth: 0,
                    minHeight: "100vh",
                    p: { xs: 2, md: 3 },
                    bgcolor: "background.default",
                    color: "text.primary",
                    boxSizing: "border-box",
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}