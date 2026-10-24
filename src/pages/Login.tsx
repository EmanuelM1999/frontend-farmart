
import { useState, type FormEvent } from "react";
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Paper,
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

//import { useNavigate } from "react-router-dom";

export default function Login() {
    //const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            //setError("Ingresa tu correo electrónico y contraseña.");
            return;
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
                            bgcolor: "rgba(59,130,246,0.15)",
                            color: "primary.light",
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

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                >
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
                        sx={{ mb: 2.5 }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlined color="action" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

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
                        sx={{ mb: 1 }}
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
                                        >
                                            {showPassword
                                                ? <VisibilityOff />
                                                : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {/*
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={rememberMe}
                                onChange={(event) =>
                                    setRememberMe(event.target.checked)
                                }
                            />
                        }
                        label={
                            <Typography variant="body2" color="text.secondary">
                                Recordarme
                            </Typography>
                        }
                        sx={{ mb: 2 }}
                    />
                    */}

                    {error && (
                        <Typography
                            role="alert"
                            color="error"
                            variant="body2"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                            py: 1.4,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 700,
                        }}
                    >
                        Iniciar sesión
                    </Button>
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
