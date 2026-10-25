import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import { kardexService } from "../services/kardex.service";
import type { MovimientoKardex } from "../types/kardex.types";

type TipoMovimiento =
    | "Entrada"
    | "Dispensación"
    | "Traslado de salida"
    | "Traslado de entrada"
    | "Ajuste";

type MovimientoInventario = {
    id: number;
    fecha: string;
    fechaOriginal: string;
    medicamento: string;
    codigo: string;
    bodega: string;
    lote: string;
    tipo: TipoMovimiento;
    cantidad: number;
    referencia: string;
    usuario: string;
};

type PaginacionMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

const tiposMovimiento: TipoMovimiento[] = [
    "Entrada",
    "Dispensación",
    "Traslado de salida",
    "Traslado de entrada",
    "Ajuste",
];

const tiposBackend: Record<string, TipoMovimiento> = {
    entrada: "Entrada",
    salida: "Dispensación",
    entrada_por_traslado: "Traslado de entrada",
    salida_por_traslado: "Traslado de salida",
    ajuste: "Ajuste",
};

function adaptarMovimiento(
    movimiento: MovimientoKardex,
): MovimientoInventario {
    return {
        id: movimiento.id,
        fecha: new Date(movimiento.created_at).toLocaleString("es-CO", {
            dateStyle: "short",
            timeStyle: "short",
        }),
        fechaOriginal: movimiento.created_at,
        medicamento: movimiento.existencia.medicamento.nombre,
        codigo: movimiento.existencia.medicamento.codigo,
        bodega: movimiento.existencia.bodega.nombre,
        lote: movimiento.existencia.lote.codigo,
        tipo: tiposBackend[movimiento.tipo_movimiento] ?? "Ajuste",
        cantidad: movimiento.cantidad,
        referencia: movimiento.motivo || `Movimiento #${movimiento.id}`,
        usuario: movimiento.usuario.nombre,
    };
}

function obtenerColorMovimiento(
    tipo: TipoMovimiento,
): "success" | "error" | "warning" | "info" | "default" {
    switch (tipo) {
        case "Entrada":
        case "Traslado de entrada":
            return "success";
        case "Dispensación":
        case "Traslado de salida":
            return "error";
        case "Ajuste":
            return "warning";
        default:
            return "default";
    }
}

function obtenerFechaISO(fecha: string): string {
    return fecha.slice(0, 10);
}

export default function Kardex() {
    const [bodega, setBodega] = useState("todas");
    const [tipo, setTipo] = useState("todos");
    const [busqueda, setBusqueda] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");

    const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);

    // MUI utiliza páginas desde 0; Laravel utiliza páginas desde 1.
    const [pagina, setPagina] = useState(0);
    const [filasPorPagina, setFilasPorPagina] = useState(10);

    const [paginacion, setPaginacion] = useState<PaginacionMeta>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Bodegas disponibles en los registros recibidos.
    const bodegasDisponibles = Array.from(
        new Set(movimientos.map((movimiento) => movimiento.bodega)),
    );

    // Reinicia la página al cambiar los filtros.
    useEffect(() => {
        setPagina(0);
    }, [bodega, tipo, busqueda, fechaDesde, fechaHasta]);

    // Consulta el endpoint real del Kardex.
    useEffect(() => {
        let activo = true;

        async function cargarMovimientos() {
            try {
                setCargando(true);
                setError(null);

                const response = await kardexService.listar({
                    page: pagina + 1,
                    per_page: filasPorPagina,
                });

                if (!activo) return;

                setMovimientos(response.data.map(adaptarMovimiento));
                setPaginacion(response.meta);
            } catch {
                if (!activo) return;

                setError("No fue posible cargar los movimientos del Kardex.");
                setMovimientos([]);
                setPaginacion({
                    current_page: 1,
                    last_page: 1,
                    per_page: filasPorPagina,
                    total: 0,
                });
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        }

        void cargarMovimientos();

        return () => {
            activo = false;
        };
    }, [pagina, filasPorPagina]);

    // Estos filtros se aplican a los registros de la página recibida.
    const textoBusqueda = busqueda.trim().toLowerCase();

    const movimientosFiltrados = movimientos.filter((movimiento) => {
        const coincideBodega =
            bodega === "todas" || movimiento.bodega === bodega;

        const coincideTipo =
            tipo === "todos" || movimiento.tipo === tipo;

        const coincideTexto = [
            movimiento.medicamento,
            movimiento.codigo,
            movimiento.lote,
            movimiento.referencia,
            movimiento.usuario,
            movimiento.bodega,
        ].some((valor) => valor.toLowerCase().includes(textoBusqueda));

        const fecha = obtenerFechaISO(movimiento.fechaOriginal);

        const coincideFechaDesde = !fechaDesde || fecha >= fechaDesde;
        const coincideFechaHasta = !fechaHasta || fecha <= fechaHasta;

        return (
            coincideBodega &&
            coincideTipo &&
            coincideTexto &&
            coincideFechaDesde &&
            coincideFechaHasta
        );
    });

    const entradas = movimientosFiltrados
        .filter((movimiento) => movimiento.cantidad > 0)
        .reduce((total, movimiento) => total + movimiento.cantidad, 0);

    const salidas = movimientosFiltrados
        .filter((movimiento) => movimiento.cantidad < 0)
        .reduce((total, movimiento) => total + Math.abs(movimiento.cantidad), 0);

    const fechasInvalidas =
        Boolean(fechaDesde && fechaHasta && fechaDesde > fechaHasta);

    return (
        <Stack
            spacing={3}
            sx={{ width: "100%", maxWidth: "none", minWidth: 0 }}
        >
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Kardex
                </Typography>

                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Historial de movimientos de inventario por bodega,
                    medicamento y lote.
                </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Card>
                <CardContent>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 2 }}
                    >
                        Historial de movimientos
                    </Typography>

                    <Stack spacing={2} sx={{ mb: 3 }}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                        >
                            <FormControl
                                size="small"
                                sx={{ width: { xs: "100%", sm: "25%" } }}
                            >
                                <InputLabel id="kardex-bodega-label">
                                    Bodega
                                </InputLabel>

                                <Select
                                    labelId="kardex-bodega-label"
                                    value={bodega}
                                    label="Bodega"
                                    onChange={(event) =>
                                        setBodega(event.target.value)
                                    }
                                >
                                    <MenuItem value="todas">
                                        Todas las bodegas
                                    </MenuItem>

                                    {bodegasDisponibles.map((nombreBodega) => (
                                        <MenuItem
                                            key={nombreBodega}
                                            value={nombreBodega}
                                        >
                                            {nombreBodega}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/*
                            <FormControl
                                size="small"
                                sx={{ width: { xs: "100%", sm: "30%" } }}
                            >
                                <InputLabel id="kardex-tipo-label">
                                    Tipo de movimiento
                                </InputLabel>

                                <Select
                                    labelId="kardex-tipo-label"
                                    value={tipo}
                                    label="Tipo de movimiento"
                                    onChange={(event) =>
                                        setTipo(event.target.value)
                                    }
                                >
                                    <MenuItem value="todos">
                                        Todos los movimientos
                                    </MenuItem>

                                    {tiposMovimiento.map((tipoMovimiento) => (
                                        <MenuItem
                                            key={tipoMovimiento}
                                            value={tipoMovimiento}
                                        >
                                            {tipoMovimiento}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            

                            <TextField
                                size="small"
                                label="Buscar lote"
                                value={busqueda}
                                onChange={(event) =>
                                    setBusqueda(event.target.value)
                                }
                                sx={{ flex: 1, minWidth: 0 }}
                            />

                            <TextField
                                size="small"
                                label="Buscar medicamento"
                                value={busqueda}
                                onChange={(event) =>
                                    setBusqueda(event.target.value)
                                }
                                sx={{ flex: 1, minWidth: 0 }}
                            />*/}
                        </Stack>

                        {/*
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                        >
                            <TextField
                                type="date"
                                size="small"
                                label="Desde"
                                value={fechaDesde}
                                onChange={(event) =>
                                    setFechaDesde(event.target.value)
                                }
                                slotProps={{
                                    inputLabel: { shrink: true },
                                }}
                                sx={{ width: { xs: "100%", sm: 220 } }}
                            />

                            <TextField
                                type="date"
                                size="small"
                                label="Hasta"
                                value={fechaHasta}
                                onChange={(event) =>
                                    setFechaHasta(event.target.value)
                                }
                                slotProps={{
                                    inputLabel: { shrink: true },
                                }}
                                sx={{ width: { xs: "100%", sm: 220 } }}
                            />
                        </Stack>
                        */}

                        {fechasInvalidas && (
                            <Alert severity="warning">
                                La fecha inicial no puede ser posterior a la
                                fecha final.
                            </Alert>
                        )}

                        <Typography variant="body2" color="text.secondary">
                            {paginacion.total} movimientos en total
                        </Typography>
                    </Stack>

                    {cargando && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 2,
                            }}
                        >
                            <CircularProgress size={20} />
                            <Typography variant="body2" color="text.secondary">
                                Cargando movimientos...
                            </Typography>
                        </Box>
                    )}

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell>Medicamento</TableCell>
                                    <TableCell>Bodega</TableCell>
                                    <TableCell>Lote</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell align="right">
                                        Cantidad
                                    </TableCell>
                                    <TableCell>Referencia</TableCell>
                                    <TableCell>Usuario</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {movimientosFiltrados.map((movimiento) => (
                                    <TableRow key={movimiento.id} hover>
                                        <TableCell
                                            sx={{ whiteSpace: "nowrap" }}
                                        >
                                            {movimiento.fecha}
                                        </TableCell>

                                        <TableCell>
                                            <Typography sx={{ fontWeight: 600 }}>
                                                {movimiento.medicamento}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {movimiento.codigo}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>{movimiento.bodega}</TableCell>
                                        <TableCell>{movimiento.lote}</TableCell>

                                        <TableCell>
                                            <Chip
                                                label={movimiento.tipo}
                                                color={obtenerColorMovimiento(
                                                    movimiento.tipo,
                                                )}
                                                size="small"
                                            />
                                        </TableCell>

                                        <TableCell
                                            align="right"
                                            sx={{
                                                whiteSpace: "nowrap",
                                                fontWeight: 600,
                                                color:
                                                    movimiento.cantidad > 0
                                                        ? "success.main"
                                                        : movimiento.cantidad < 0
                                                          ? "error.main"
                                                          : "text.primary",
                                            }}
                                        >
                                            {movimiento.cantidad > 0 ? "+" : ""}
                                            {movimiento.cantidad}
                                        </TableCell>

                                        <TableCell>
                                            {movimiento.referencia}
                                        </TableCell>

                                        <TableCell>{movimiento.usuario}</TableCell>
                                    </TableRow>
                                ))}

                                {!cargando &&
                                    (fechasInvalidas ||
                                        movimientosFiltrados.length === 0) && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                align="center"
                                            >
                                                {fechasInvalidas
                                                    ? "Verifica el rango de fechas."
                                                    : error
                                                      ? "No se pudieron cargar los movimientos."
                                                      : "No se encontraron movimientos."}
                                            </TableCell>
                                        </TableRow>
                                    )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={paginacion.total}
                        page={pagina}
                        rowsPerPage={filasPorPagina}
                        onPageChange={(_, nuevaPagina) => {
                            setPagina(nuevaPagina);
                        }}
                        onRowsPerPageChange={(event) => {
                            setFilasPorPagina(Number(event.target.value));
                            setPagina(0);
                        }}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        labelRowsPerPage="Filas por página:"
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}-${to} de ${count}`
                        }
                    />
                </CardContent>
            </Card>
        </Stack>
    );
}
