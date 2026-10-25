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

type InventarioItem = {
    id: number;
    medicamento: string;
    codigo: string;
    bodega: string;
    lote: string;
    vencimiento: string;
    existencia: number;
    minimo: number;
};

type PaginacionMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type InventarioResponse = {
    data: InventarioItem[];
    meta: PaginacionMeta;
};

type FiltrosInventario = {
    page: number;
    perPage: number;
    bodega: string;
    search: string;
};

const datosDemo: InventarioItem[] = [
    {
        id: 1,
        medicamento: "Acetaminofén 500 mg",
        codigo: "MED-001",
        bodega: "Bodega principal",
        lote: "AC-2026-01",
        vencimiento: "2026-11-15",
        existencia: 120,
        minimo: 50,
    },
    {
        id: 2,
        medicamento: "Clonazepam 0.5 mg",
        codigo: "MED-002",
        bodega: "Bodega principal",
        lote: "CL-2026-04",
        vencimiento: "2027-06-30",
        existencia: 12,
        minimo: 20,
    },
    {
        id: 3,
        medicamento: "Ibuprofeno 400 mg",
        codigo: "MED-003",
        bodega: "Bodega secundaria",
        lote: "IB-2026-02",
        vencimiento: "2027-03-20",
        existencia: 85,
        minimo: 30,
    },
    {
        id: 4,
        medicamento: "Amoxicilina 500 mg",
        codigo: "MED-004",
        bodega: "Bodega principal",
        lote: "AM-2026-08",
        vencimiento: "2026-12-10",
        existencia: 18,
        minimo: 25,
    },
];

function diasParaVencer(fecha: string): number {
    const [anio, mes, dia] = fecha.split("-").map(Number);
    const vencimiento = Date.UTC(anio, mes - 1, dia);

    const ahora = new Date();
    const hoy = Date.UTC(
        ahora.getFullYear(),
        ahora.getMonth(),
        ahora.getDate(),
    );

    return Math.round((vencimiento - hoy) / 86_400_000);
}

/**
 * Simula una respuesta paginada de Laravel.
 * Se reemplazará por una petición HTTP cuando se configure Axios.
 */
function consultarInventarioMock({
    page,
    perPage,
    bodega,
    search,
}: FiltrosInventario): InventarioResponse {
    const texto = search.trim().toLowerCase();

    const filtrados = datosDemo.filter((item) => {
        const coincideBodega =
            bodega === "todas" || item.bodega === bodega;

        const coincideTexto = [
            item.medicamento,
            item.codigo,
            item.lote,
        ].some((valor) => valor.toLowerCase().includes(texto));

        return coincideBodega && coincideTexto;
    });

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

export default function Inventario() {
    const [bodega, setBodega] = useState("todas");
    const [busqueda, setBusqueda] = useState("");

    const [inventario, setInventario] = useState<InventarioItem[]>([]);

    // MUI comienza las páginas en 0; Laravel normalmente en 1.
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

    // Reinicia la paginación cuando cambian los filtros.
    useEffect(() => {
        setPagina(0);
    }, [bodega, busqueda]);

    // Carga los registros de la página seleccionada.
    useEffect(() => {
        let activo = true;

        async function cargarInventario() {
            try {
                setCargando(true);
                setError(null);

                // Temporal: reemplazar por Axios cuando esté configurado.
                const response = consultarInventarioMock({
                    page: pagina + 1,
                    perPage: filasPorPagina,
                    bodega,
                    search: busqueda,
                });

                if (!activo) return;

                setInventario(response.data);
                setPaginacion(response.meta);
            } catch {
                if (activo) {
                    setError("No fue posible cargar el inventario.");
                    setInventario([]);
                }
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        }

        void cargarInventario();

        return () => {
            activo = false;
        };
    }, [pagina, filasPorPagina, bodega, busqueda]);

    // Estas alertas son temporales y corresponden a la página actual.
    // Más adelante se pueden alimentar con un resumen del backend.
    const lotesVencidos = inventario.filter(
        (item) => diasParaVencer(item.vencimiento) < 0,
    );

    const lotesPorVencer = inventario.filter((item) => {
        const dias = diasParaVencer(item.vencimiento);
        return dias >= 0 && dias <= 90;
    });

    const productosBajoMinimo = inventario.filter(
        (item) => item.existencia < item.minimo,
    );

    return (
        <Stack
            spacing={3}
            sx={{ width: "100%", maxWidth: "none", minWidth: 0 }}
        >
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Inventario
                </Typography>

                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Existencias, lotes y alertas por bodega.
                </Typography>
            </Box>

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
                            Lotes consultados
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {paginacion.total}
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography color="text.secondary" variant="body2">
                            Próximos a vencer
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {lotesPorVencer.length}
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography color="text.secondary" variant="body2">
                            Bajo stock mínimo
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {productosBajoMinimo.length}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            {lotesVencidos.length > 0 && (
                <Alert severity="error">
                    Hay {lotesVencidos.length} lote(s) vencido(s) en esta
                    página. No deben utilizarse para dispensaciones ni
                    traslados.
                </Alert>
            )}

            {lotesPorVencer.length > 0 && (
                <Alert severity="warning">
                    Hay {lotesPorVencer.length} lote(s) próximos a vencer
                    en esta página.
                </Alert>
            )}

            {productosBajoMinimo.length > 0 && (
                <Alert severity="error">
                    Hay {productosBajoMinimo.length} registro(s) por debajo
                    del stock mínimo en esta página.
                </Alert>
            )}

            <Card>
                <CardContent>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 2 }}
                    >
                        Existencias por lote
                    </Typography>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        sx={{ mb: 3 }}
                    >
                        <FormControl size="small"
                            sx={{
                                width: { xs: "100%", sm: "25%" },
                            }}>
                            <InputLabel id="bodega-label">Bodega</InputLabel>
                            <Select
                                labelId="bodega-label"
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

                        {/*
                        <TextField
                            fullWidth
                            size="small"
                            label="Buscar medicamento o lote"
                            value={busqueda}
                            onChange={(event) =>
                                setBusqueda(event.target.value)
                            }
                        />
                        */}
                    </Stack>

                    {cargando && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Cargando inventario...
                        </Alert>
                    )}

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Medicamento</TableCell>
                                    <TableCell>Bodega</TableCell>
                                    <TableCell>Lote</TableCell>
                                    <TableCell>Vencimiento</TableCell>
                                    <TableCell align="right">
                                        Existencia
                                    </TableCell>
                                    <TableCell align="right">
                                        Mínimo
                                    </TableCell>
                                    <TableCell>Estado</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {inventario.map((item) => {
                                    const dias = diasParaVencer(
                                        item.vencimiento,
                                    );
                                    const vencido = dias < 0;
                                    const bajoMinimo =
                                        item.existencia < item.minimo;
                                    const porVencer =
                                        dias >= 0 && dias <= 90;

                                    let estado = "Normal";
                                    let color:
                                        | "success"
                                        | "warning"
                                        | "error" = "success";

                                    if (vencido) {
                                        estado = "Vencido";
                                        color = "error";
                                    } else if (porVencer) {
                                        estado = "Por vencer";
                                        color = "warning";
                                    }

                                    return (
                                        <TableRow key={item.id} hover>
                                            <TableCell>
                                                <Typography
                                                    sx={{ fontWeight: 600 }}
                                                >
                                                    {item.medicamento}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {item.codigo}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>{item.bodega}</TableCell>
                                            <TableCell>{item.lote}</TableCell>
                                            <TableCell>
                                                {item.vencimiento}
                                            </TableCell>
                                            <TableCell align="right">
                                                {item.existencia}
                                            </TableCell>
                                            <TableCell align="right">
                                                {item.minimo}
                                            </TableCell>
                                            <TableCell>
                                                <Stack
                                                    direction="row"
                                                    spacing={0.5}
                                                    useFlexGap
                                                    sx={{ flexWrap: "wrap" }}
                                                >
                                                    <Chip
                                                        label={estado}
                                                        color={color}
                                                        size="small"
                                                    />

                                                    {bajoMinimo && (
                                                        <Chip
                                                            label="Stock bajo"
                                                            color="error"
                                                            size="small"
                                                        />
                                                    )}
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                                {!cargando && inventario.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            align="center"
                                        >
                                            {error
                                                ? "No se pudo cargar el inventario."
                                                : "No se encontraron registros."}
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