
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
} from "@mui/icons-material";

//import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 250;

const menuItems = [
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
    //const location = useLocation();
    //const navigate = useNavigate();

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
                },
            }}
        >
            <Toolbar>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: "text.primary",
                        whiteSpace: "nowrap",
                    }}
                >
                    Farmart IPS
                </Typography>
            </Toolbar>

            <Divider />

            <Box sx={{ overflow: "auto", p: 1 }}>
                <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ px: 2, pt: 1 }}
                >
                    Menú principal
                </Typography>

                <List>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <ListItemButton
                                key={item.path}
                                selected={isActive}
                                //onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    mb: 0.5,
                                    color: "text.secondary",

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
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>

                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        );
                    })}
                </List>
            </Box>
        </Drawer>
    );
}
