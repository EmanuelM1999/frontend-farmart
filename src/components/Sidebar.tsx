import {
    Box,
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";

import {
    MedicationOutlined,
    SwapHoriz,
    Inventory2Outlined,
    HistoryOutlined,
    LogoutOutlined,
} from "@mui/icons-material";

import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    rolesPorRuta,
    type RutaConPermisos,
} from "../permissions/roles";

const drawerWidth = 250;

const menuItems: {
    label: string;
    path: RutaConPermisos;
    icon: React.ReactNode;
}[] = [
    {
        label: "Dispensación",
        path: "/dispensacion",
        icon: <MedicationOutlined />,
    },
    {
        label: "Traslados",
        path: "/traslados",
        icon: <SwapHoriz />,
    },
    {
        label: "Inventario",
        path: "/inventario",
        icon: <Inventory2Outlined />,
    },
    {
        label: "Kardex",
        path: "/kardex",
        icon: <HistoryOutlined />,
    },
];

export { drawerWidth };

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cerrarSesion, usuario } = useAuth();

    const [cerrandoSesion, setCerrandoSesion] = useState(false);

    // Filtrar las opciones según el rol del usuario autenticado.
    const menuVisible = menuItems.filter((item) => {
        if (!usuario) return false;

        const rolesPermitidos = rolesPorRuta[item.path];

        return rolesPermitidos?.includes(usuario.rol) ?? false;
    });

    const handleLogout = async () => {
        setCerrandoSesion(true);

        try {
            await cerrarSesion();
        } catch {
            // Aunque falle la petición al servidor,
            // el cierre local debe permitir salir de la aplicación.
        } finally {
            navigate("/login", { replace: true });
            setCerrandoSesion(false);
        }
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    bgcolor: "background.paper",
                    color: "text.primary",
                    borderRight: 1,
                    borderColor: "divider",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            <Toolbar>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
                >
                    Farmart IPS
                </Typography>
            </Toolbar>

            <Divider />

            <Box sx={{ overflow: "auto", p: 1, flex: 1 }}>
                <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ px: 2, pt: 1 }}
                >
                    Menú principal
                </Typography>

                <List>
                    {menuVisible.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <ListItemButton
                                key={item.path}
                                component={NavLink}
                                to={item.path}
                                selected={isActive}
                                sx={{
                                    borderRadius: 2,
                                    mb: 0.5,
                                    color: "text.secondary",
                                    textDecoration: "none",

                                    "& .MuiListItemIcon-root": {
                                        color: "text.secondary",
                                        minWidth: 40,
                                    },

                                    "&:hover": {
                                        bgcolor: "action.hover",
                                        color: "text.primary",
                                    },

                                    "&.Mui-selected": {
                                        bgcolor: "primary.main",
                                        color: "primary.contrastText",
                                    },

                                    "&.Mui-selected .MuiListItemIcon-root": {
                                        color: "inherit",
                                    },

                                    "&.Mui-selected:hover": {
                                        bgcolor: "primary.dark",
                                    },
                                }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        );
                    })}
                </List>
            </Box>

            <Divider />

            <Box sx={{ p: 1 }}>
                {usuario && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            px: 2,
                            py: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {usuario.name}
                    </Typography>
                )}

                <ListItemButton
                    onClick={handleLogout}
                    disabled={cerrandoSesion}
                    sx={{
                        borderRadius: 2,
                        color: "error.main",

                        "& .MuiListItemIcon-root": {
                            color: "error.main",
                            minWidth: 40,
                        },

                        "&:hover": {
                            bgcolor: "error.main",
                            color: "error.contrastText",
                        },

                        "&:hover .MuiListItemIcon-root": {
                            color: "inherit",
                        },
                    }}
                >
                    <ListItemIcon>
                        <LogoutOutlined />
                    </ListItemIcon>

                    <ListItemText
                        primary={
                            cerrandoSesion
                                ? "Cerrando sesión..."
                                : "Cerrar sesión"
                        }
                    />
                </ListItemButton>
            </Box>
        </Drawer>
    );
}
