
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
    Typography,
} from "@mui/material";

import {
    inventarioService,
    type InventarioItem,
} from "../services/inventario.service";

type BodegaOption = {
    id: number;
    codigo: string;
    nombre: string;
};

export default function Inventario() {
    const [inventario, setInventario] = useState<InventarioItem[]>([]);
    const [bodegas, setBodegas] = useState<BodegaOption[]>([]);
    const [bodegaId, setBodegaId] = useState<number | "todas">("todas");

    // MUI usa páginas desde 0; Laravel desde 1.
    const [pagina, setPagina] = useState(0);
    const [filasPorPagina, setFilasPorPagina] = useState(10);

    const [total, setTotal] = useState(0);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let activo = true;

        async function cargarInventario() {
            setCargando(true);
            setError(null);

            try {
                const respuesta = await inventarioService.listar(
                    bodegaId === "todas" ? undefined : bodegaId,
                    pagina + 1,
                    filasPorPagina,
                );

                if (!activo) return;

                setInventario(respuesta.data);
                setTotal(respuesta.meta.total);

                // Conserva las bodegas que ya se hayan encontrado.
                setBodegas((anteriores) => {
                    const mapa = new Map(
                        anteriores.map((bodega) => [bodega.id, bodega]),
                    );

                    respuesta.data.forEach((item) => {
                        mapa.set(item.bodega.id, item.bodega);
                    });

                    return Array.from(mapa.values());
                });
            } catch {
                if (!activo) return;

                setError("No fue posible cargar el inventario.");
                setInventario([]);
                setTotal(0);
            } finally {
                if (activo) setCargando(false);
            }
        }

        void cargarInventario();

        return () => {
            activo = false;
        };
    }, [bodegaId, pagina, filasPorPagina]);

    return (
        <Stack spacing={3} sx={{ width: "100%", minWidth: 0 }}>
            <Box>
                <Typography variant="h4"
                    sx={{
                        fontWeight: 700
                    }}>
                    Inventario
                </Typography>

                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Consulta de existencias por bodega, medicamento y lote.
                </Typography>
            </Box>

            <Card>
                <CardContent>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        sx={{
                            alignItems: { sm: "center" },
                            justifyContent: "space-between",
                        }}
                    >
                        <Box>
                            <Typography variant="h6"
                                sx={{
                                    fontWeight: 600
                                }}>
                                Existencias por lote
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {total} registro(s) encontrados
                            </Typography>
                        </Box>

                        <FormControl
                            size="small"
                            sx={{ width: { xs: "100%", sm: 280 } }}
                        >
                            <InputLabel id="bodega-label">
                                Bodega
                            </InputLabel>

                            <Select
                                labelId="bodega-label"
                                label="Bodega"
                                value={bodegaId}
                                onChange={(event) => {
                                    const valor = event.target.value;

                                    setBodegaId(
                                        valor === "todas"
                                            ? "todas"
                                            : Number(valor),
                                    );
                                    setPagina(0);
                                }}
                            >
                                <MenuItem value="todas">
                                    Todas las bodegas
                                </MenuItem>

                                {bodegas.map((bodega) => (
                                    <MenuItem
                                        key={bodega.id}
                                        value={bodega.id}
                                    >
                                        {bodega.nombre} ({bodega.codigo})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {cargando && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            Cargando inventario...
                        </Alert>
                    )}

                    <TableContainer sx={{ mt: 3 }}>
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
                                    <TableCell>Control especial</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {inventario.map((item) => (
                                    <TableRow key={item.id} hover>
                                        <TableCell>
                                            <Typography sx={{
                                                fontWeight: 600
                                            }}>
                                                {item.medicamento.nombre}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {item.medicamento.codigo}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography>
                                                {item.bodega.nombre}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {item.bodega.codigo}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography>
                                                {item.lote.codigo}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            {new Date(
                                                item.lote.fecha_vencimiento,
                                            ).toLocaleDateString("es-CO", {
                                                timeZone: "UTC",
                                            })}
                                        </TableCell>

                                        <TableCell align="right">
                                            <Typography sx={{
                                                fontWeight: 600
                                            }}>
                                                {item.cantidad.toLocaleString(
                                                    "es-CO",
                                                )}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {item.medicamento.unidad_medida}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={
                                                    item.medicamento
                                                        .control_especial
                                                        ? "Sí"
                                                        : "No"
                                                }
                                                color={
                                                    item.medicamento
                                                        .control_especial
                                                        ? "warning"
                                                        : "default"
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {!cargando && inventario.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            align="center"
                                            sx={{ py: 5 }}
                                        >
                                            {error
                                                ? "No se pudo consultar el inventario."
                                                : "No se encontraron registros."}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={total}
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
