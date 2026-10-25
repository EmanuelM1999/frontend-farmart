import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    Visibility,
    VisibilityOff,
    LocalHospitalOutlined,
    LockOutlined,
    EmailOutlined,
} from "@mui/icons-material";

import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { iniciarSesion, autenticado, usuario } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);


    if (autenticado) {
        return <Navigate to="/inventario" replace />;
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setCargando(true);

        try {
            await iniciarSesion({
                email: email.trim(),
                password,
            });

            const rol = usuario?.rol;

            const destino =
                (location.state as { from?: { pathname: string } } | null)
                    ?.from?.pathname ??
                (rol === "admin"
                    ? "/usuarios"
                    : rol === "medico"
                        ? "/dispensacion"
                        : "/inventario");

            navigate(destino, { replace: true });
        } catch {
            setError(
                "No fue posible iniciar sesión. Verifica tu correo y contraseña.",
            );
        } finally {
            setCargando(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                bgcolor: "background.default",
                backgroundImage:
                    "radial-gradient(ellipse at top, rgba(59,130,246,0.12), transparent 60%)",
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 420,
                    p: { xs: 3, sm: 4 },
                    bgcolor: "background.paper",
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 3,
                    boxShadow: "0 16px 45px rgba(0,0,0,0.06)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mb: 4,
                    }}
                >
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 3,
                            bgcolor: "rgba(59,130,246,0.12)",
                            color: "primary.main",
                            mb: 2,
                        }}
                    >
                        <LocalHospitalOutlined sx={{ fontSize: 36 }} />
                    </Box>

                    <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: "text.primary" }}
                    >
                        Farmart IPS
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1, textAlign: "center" }}
                    >
                        Ingresa tus credenciales para continuar
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2.5}>
                        <Box>
                            <Typography
                                variant="body2"
                                sx={{ mb: 1, fontWeight: 600 }}
                            >
                                Correo electrónico
                            </Typography>

                            <TextField
                                fullWidth
                                type="email"
                                placeholder="usuario@farmart.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="username"
                                required
                                disabled={cargando}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailOutlined color="action" />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                    },
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                sx={{ mb: 1, fontWeight: 600 }}
                            >
                                Contraseña
                            </Typography>

                            <TextField
                                fullWidth
                                type={showPassword ? "text" : "password"}
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                autoComplete="current-password"
                                required
                                disabled={cargando}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlined color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={
                                                        showPassword
                                                            ? "Ocultar contraseña"
                                                            : "Mostrar contraseña"
                                                    }
                                                    onClick={() =>
                                                        setShowPassword((previous) => !previous)
                                                    }
                                                    edge="end"
                                                    disabled={cargando}
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                    },
                                }}
                            />
                        </Box>

                        {error && (
                            <Alert
                                severity="error"
                                onClose={() => setError("")}
                            >
                                {error}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={cargando}
                            sx={{
                                py: 1.4,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 700,
                                boxShadow: "none",
                                "&:hover": {
                                    boxShadow: "0 5px 14px rgba(25,118,210,0.2)",
                                },
                            }}
                        >
                            {cargando ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Iniciar sesión"
                            )}
                        </Button>
                    </Stack>
                </Box>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: "block",
                        textAlign: "center",
                        mt: 4,
                    }}
                >
                    Sistema de gestión · Farmart IPS
                </Typography>
            </Paper>
        </Box>
    );
}
