import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
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

type TipoMovimiento =
    | "Entrada"
    | "Dispensación"
    | "Traslado de salida"
    | "Traslado de entrada"
    | "Ajuste";

type MovimientoInventario = {
    id: number;
    fecha: string;
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

type KardexResponse = {
    data: MovimientoInventario[];
    meta: PaginacionMeta;
};

type FiltrosKardex = {
    page: number;
    perPage: number;
    bodega: string;
    tipo: string;
    search: string;
    fechaDesde: string;
    fechaHasta: string;
};

const movimientosDemo: MovimientoInventario[] = [
    {
        id: 1,
        fecha: "2026-10-24 09:30",
        medicamento: "Acetaminofén 500 mg",
        codigo: "MED-001",
        bodega: "Bodega principal",
        lote: "AC-2026-01",
        tipo: "Entrada",
        cantidad: 100,
        referencia: "COMP-0001",
        usuario: "admin",
    },
    {
        id: 2,
        fecha: "2026-10-24 10:15",
        medicamento: "Acetaminofén 500 mg",
        codigo: "MED-001",
        bodega: "Bodega principal",
        lote: "AC-2026-01",
        tipo: "Dispensación",
        cantidad: -5,
        referencia: "DIS-0001",
        usuario: "auxiliar1",
    },
    {
        id: 3,
        fecha: "2026-10-23 14:20",
        medicamento: "Clonazepam 0.5 mg",
        codigo: "MED-002",
        bodega: "Bodega principal",
        lote: "CL-2026-04",
        tipo: "Dispensación",
        cantidad: -2,
        referencia: "DIS-0002",
        usuario: "auxiliar1",
    },
    {
        id: 4,
        fecha: "2026-10-23 11:00",
        medicamento: "Ibuprofeno 400 mg",
        codigo: "MED-003",
        bodega: "Bodega principal",
        lote: "IB-2026-02",
        tipo: "Traslado de salida",
        cantidad: -20,
        referencia: "TRA-0001",
        usuario: "admin",
    },
    {
        id: 5,
        fecha: "2026-10-23 16:45",
        medicamento: "Ibuprofeno 400 mg",
        codigo: "MED-003",
        bodega: "Bodega secundaria",
        lote: "IB-2026-02",
        tipo: "Traslado de entrada",
        cantidad: 20,
        referencia: "TRA-0001",
        usuario: "admin",
    },
    {
        id: 6,
        fecha: "2026-10-22 08:40",
        medicamento: "Amoxicilina 500 mg",
        codigo: "MED-004",
        bodega: "Bodega principal",
        lote: "AM-2026-08",
        tipo: "Ajuste",
        cantidad: -1,
        referencia: "AJU-0001",
        usuario: "regente",
    },
    {
        id: 7,
        fecha: "2026-10-21 13:10",
        medicamento: "Acetaminofén 500 mg",
        codigo: "MED-001",
        bodega: "Bodega secundaria",
        lote: "AC-2026-01",
        tipo: "Entrada",
        cantidad: 50,
        referencia: "COMP-0002",
        usuario: "admin",
    },
    {
        id: 8,
        fecha: "2026-10-20 15:30",
        medicamento: "Ibuprofeno 400 mg",
        codigo: "MED-003",
        bodega: "Bodega secundaria",
        lote: "IB-2026-02",
        tipo: "Dispensación",
        cantidad: -3,
        referencia: "DIS-0003",
        usuario: "auxiliar1",
    },
    {
        id: 9,
        fecha: "2026-10-19 10:00",
        medicamento: "Amoxicilina 500 mg",
        codigo: "MED-004",
        bodega: "Bodega principal",
        lote: "AM-2026-08",
        tipo: "Entrada",
        cantidad: 30,
        referencia: "COMP-0003",
        usuario: "admin",
    },
    {
        id: 10,
        fecha: "2026-10-18 09:15",
        medicamento: "Clonazepam 0.5 mg",
        codigo: "MED-002",
        bodega: "Bodega principal",
        lote: "CL-2026-04",
        tipo: "Ajuste",
        cantidad: 2,
        referencia: "AJU-0002",
        usuario: "regente",
    },
    {
        id: 11,
        fecha: "2026-10-17 12:00",
        medicamento: "Acetaminofén 500 mg",
        codigo: "MED-001",
        bodega: "Bodega principal",
        lote: "AC-2026-01",
        tipo: "Dispensación",
        cantidad: -4,
        referencia: "DIS-0004",
        usuario: "auxiliar1",
    },
    {
        id: 12,
        fecha: "2026-10-16 08:30",
        medicamento: "Ibuprofeno 400 mg",
        codigo: "MED-003",
        bodega: "Bodega secundaria",
        lote: "IB-2026-02",
        tipo: "Ajuste",
        cantidad: -2,
        referencia: "AJU-0003",
        usuario: "regente",
    },
];

const tiposMovimiento: TipoMovimiento[] = [
    "Entrada",
    "Dispensación",
    "Traslado de salida",
    "Traslado de entrada",
    "Ajuste",
];

/**
 * Simula una respuesta paginada.
 * Más adelante se reemplazará por el servicio HTTP de Kardex.
 */
function consultarKardexMock({
    page,
    perPage,
    bodega,
    tipo,
    search,
    fechaDesde,
    fechaHasta,
}: FiltrosKardex): KardexResponse {
    const texto = search.trim().toLowerCase();

    const filtrados = movimientosDemo
        .filter((movimiento) => {
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
            ].some((valor) => valor.toLowerCase().includes(texto));

            const fecha = movimiento.fecha.slice(0, 10);
            const coincideFechaDesde =
                !fechaDesde || fecha >= fechaDesde;
            const coincideFechaHasta =
                !fechaHasta || fecha <= fechaHasta;

            return (
                coincideBodega &&
                coincideTipo &&
                coincideTexto &&
                coincideFechaDesde &&
                coincideFechaHasta
            );
        })
        .sort((a, b) => b.fecha.localeCompare(a.fecha));

    const total = filtrados.length;
    const ultimaPagina = Math.max(1, Math.ceil(total / perPage));
    const paginaValida = Math.min(Math.max(1, page), ultimaPagina);
    const inicio = (paginaValida - 1) * perPage;

    return {
        data: filtrados.slice(inicio, inicio + perPage),
        meta: {
            current_page: paginaValida,
            last_page: ultimaPagina,
            per_page: perPage,
            total,
        },
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

export default function Kardex() {
    const [bodega, setBodega] = useState("todas");
    const [tipo, setTipo] = useState("todos");
    const [busqueda, setBusqueda] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");

    const [movimientos, setMovimientos] = useState<
        MovimientoInventario[]
    >([]);

    // MUI utiliza páginas desde 0; la respuesta simulada utiliza páginas desde 1.
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

    // Reinicia la página al cambiar filtros.
    useEffect(() => {
        setPagina(0);
    }, [bodega, tipo, busqueda, fechaDesde, fechaHasta]);

    useEffect(() => {
        let activo = true;

        async function cargarMovimientos() {
            try {
                setCargando(true);
                setError(null);

                // Temporal: posteriormente se conectará con Axios.
                const response = consultarKardexMock({
                    page: pagina + 1,
                    perPage: filasPorPagina,
                    bodega,
                    tipo,
                    search: busqueda,
                    fechaDesde,
                    fechaHasta,
                });

                if (!activo) return;

                setMovimientos(response.data);
                setPaginacion(response.meta);
            } catch {
                if (activo) {
                    setError("No fue posible cargar los movimientos.");
                    setMovimientos([]);
                }
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
    }, [
        pagina,
        filasPorPagina,
        bodega,
        tipo,
        busqueda,
        fechaDesde,
        fechaHasta,
    ]);

    const entradas = movimientos
        .filter((movimiento) => movimiento.cantidad > 0)
        .reduce((total, movimiento) => total + movimiento.cantidad, 0);

    const salidas = movimientos
        .filter((movimiento) => movimiento.cantidad < 0)
        .reduce((total, movimiento) => total + Math.abs(movimiento.cantidad), 0);

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
            {/*
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: 2,
                }}
            >
                <Card>
                    <CardContent>
                        <Typography color="text.secondary" variant="body2">
                            Movimientos encontrados
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {paginacion.total}
                        </Typography>
                    </CardContent>
                </Card>

                
                <Card>
                    <CardContent>
                        <Typography color="text.secondary" variant="body2">
                            Unidades de entrada
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{ fontWeight: 700, color: "success.main" }}
                        >
                            +{entradas}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            En la página actual
                        </Typography>
                    </CardContent>
                </Card>
                

                <Card>
                    <CardContent>
                        <Typography color="text.secondary" variant="body2">
                            Unidades de salida
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{ fontWeight: 700, color: "error.main" }}
                        >
                            -{salidas}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            En la página actual
                        </Typography>
                    </CardContent>
                </Card>
            </Box>*/}

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
                                    <MenuItem value="Bodega principal">
                                        Bodega principal
                                    </MenuItem>
                                    <MenuItem value="Bodega secundaria">
                                        Bodega secundaria
                                    </MenuItem>
                                </Select>
                            </FormControl>

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
                                label="Buscar medicamento, lote o referencia"
                                value={busqueda}
                                onChange={(event) =>
                                    setBusqueda(event.target.value)
                                }
                                sx={{ flex: 1, minWidth: 0 }}
                            />
                        </Stack>

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

                        {fechaDesde && fechaHasta && fechaDesde > fechaHasta && (
                            <Alert severity="warning">
                                La fecha inicial no puede ser posterior a la
                                fecha final.
                            </Alert>
                        )}
                    </Stack>

                    {cargando && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Cargando movimientos...
                        </Alert>
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
                                {movimientos.map((movimiento) => (
                                    <TableRow key={movimiento.id} hover>
                                        <TableCell sx={{ whiteSpace: "nowrap" }}>
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

                                {!cargando && movimientos.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            {error
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
