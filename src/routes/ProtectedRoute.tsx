import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import { useAuth } from "../context/AuthContext";
import type { RolUsuario } from "../services/auth.service";

interface ProtectedRouteProps {
    rolesPermitidos?: RolUsuario[];
}

export default function ProtectedRoute({
    rolesPermitidos,
}: ProtectedRouteProps) {
    const { usuario, autenticado, cargando } = useAuth();
    const location = useLocation();

    if (cargando) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!autenticado || !usuario) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    if (
        rolesPermitidos &&
        !rolesPermitidos.includes(usuario.rol)
    ) {
        return <Navigate to="/acceso-denegado" replace />;
    }

    return <Outlet />;
}