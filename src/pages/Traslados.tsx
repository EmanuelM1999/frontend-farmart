import { useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
import type { SelectChangeEvent } from "@mui/material";

/*
type RolUsuario =
    | "auxiliar_farmacia"
    | "regente_farmacia"
    | "medico"
    | "auditor"
    | "admin";
*/

type EstadoTraslado =
    | "BORRADOR"
    | "SOLICITADO"
    | "APROBADO"
    | "EN_TRANSITO"
    | "RECIBIDO"
    | "RECIBIDO_PARCIAL"
    | "ANULADO";

type DetalleTraslado = {
    id: number;
    medicamento: string;
    codigo: string;
    lote: string;
    cantidadSolicitada: number;
    cantidadEnviada: number;
    cantidadRecibida: number;
};

type Traslado = {
    id: number;
    numero: string;
    origen: string;
    destino: string;
    fecha: string;
    solicitanteId: number;
    solicitante: string;
    aprobadorId: number | null;
    aprobador: string | null;
    estado: EstadoTraslado;
    motivoDiscrepancia: string;
    detalles: DetalleTraslado[];
};

const bodegasDemo = [
    "Bodega principal",
    "Bodega secundaria",
];

const trasladosIniciales: Traslado[] = [
    {
        id: 1,
        numero: "TRA-2026-001",
        origen: "Bodega principal",
        destino: "Bodega secundaria",
        fecha: "2026-10-23",
        solicitanteId: 1,
        solicitante: "Auxiliar de farmacia",
        aprobadorId: 3,
        aprobador: "Regente de farmacia",
        estado: "EN_TRANSITO",
        motivoDiscrepancia: "",
        detalles: [
            {
                id: 1,
                medicamento: "Ibuprofeno 400 mg",
                codigo: "MED-003",
                lote: "IB-2026-02",
                cantidadSolicitada: 20,
                cantidadEnviada: 20,
                cantidadRecibida: 0,
            },
        ],
    },
    {
        id: 2,
        numero: "TRA-2026-002",
        origen: "Bodega principal",
        destino: "Bodega secundaria",
        fecha: "2026-10-22",
        solicitanteId: 2,
        solicitante: "Auxiliar de farmacia",
        aprobadorId: null,
        aprobador: null,
        estado: "SOLICITADO",
        motivoDiscrepancia: "",
        detalles: [
            {
                id: 2,
                medicamento: "Acetaminofén 500 mg",
                codigo: "MED-001",
                lote: "AC-2026-01",
                cantidadSolicitada: 30,
                cantidadEnviada: 0,
                cantidadRecibida: 0,
            },
        ],
    },
    {
        id: 3,
        numero: "TRA-2026-003",
        origen: "Bodega secundaria",
        destino: "Bodega principal",
        fecha: "2026-10-21",
        solicitanteId: 4,
        solicitante: "Auxiliar de farmacia",
        aprobadorId: 3,
        aprobador: "Regente de farmacia",
        estado: "RECIBIDO_PARCIAL",
        motivoDiscrepancia: "Se recibieron 8 unidades; faltan 2.",
        detalles: [
            {
                id: 3,
                medicamento: "Amoxicilina 500 mg",
                codigo: "MED-004",
                lote: "AM-2026-08",
                cantidadSolicitada: 10,
                cantidadEnviada: 10,
                cantidadRecibida: 8,
            },
        ],
    },
    {
        id: 4,
        numero: "TRA-2026-004",
        origen: "Bodega principal",
        destino: "Bodega secundaria",
        fecha: "2026-10-24",
        solicitanteId: 2,
        solicitante: "Auxiliar de farmacia",
        aprobadorId: null,
        aprobador: null,
        estado: "BORRADOR",
        motivoDiscrepancia: "",
        detalles: [
            {
                id: 4,
                medicamento: "Clonazepam 0.5 mg",
                codigo: "MED-002",
                lote: "CL-2026-04",
                cantidadSolicitada: 5,
                cantidadEnviada: 0,
                cantidadRecibida: 0,
            },
        ],
    },
    {
        id: 5,
        numero: "TRA-2026-005",
        origen: "Bodega secundaria",
        destino: "Bodega principal",
        fecha: "2026-10-18",
        solicitanteId: 1,
        solicitante: "Auxiliar de farmacia",
        aprobadorId: 3,
        aprobador: "Regente de farmacia",
        estado: "RECIBIDO",
        motivoDiscrepancia: "",
        detalles: [
            {
                id: 5,
                medicamento: "Acetaminofén 500 mg",
                codigo: "MED-001",
                lote: "AC-2026-01",
                cantidadSolicitada: 15,
                cantidadEnviada: 15,
                cantidadRecibida: 15,
            },
        ],
    },
    {
        id: 6,
        numero: "TRA-2026-006",
        origen: "Bodega principal",
        destino: "Bodega secundaria",
        fecha: "2026-10-17",
        solicitanteId: 2,
        solicitante: "Auxiliar de farmacia",
        aprobadorId: null,
        aprobador: null,
        estado: "ANULADO",
        motivoDiscrepancia: "",
        detalles: [
            {
                id: 6,
                medicamento: "Ibuprofeno 400 mg",
                codigo: "MED-003",
                lote: "IB-2026-02",
                cantidadSolicitada: 5,
                cantidadEnviada: 0,
                cantidadRecibida: 0,
            },
        ],
    },
];

const estadosTraslado: EstadoTraslado[] = [
    "BORRADOR",
    "SOLICITADO",
    "APROBADO",
    "EN_TRANSITO",
    "RECIBIDO",
    "RECIBIDO_PARCIAL",
    "ANULADO",
];

function colorEstado(
    estado: EstadoTraslado,
): "default" | "info" | "primary" | "warning" | "success" | "error" {
    switch (estado) {
        case "BORRADOR":
            return "default";
        case "SOLICITADO":
            return "info";
        case "APROBADO":
            return "primary";
        case "EN_TRANSITO":
            return "warning";
        case "RECIBIDO":
            return "success";
        case "RECIBIDO_PARCIAL":
            return "warning";
        case "ANULADO":
            return "error";
    }
}

function etiquetaEstado(estado: EstadoTraslado): string {
    const etiquetas: Record<EstadoTraslado, string> = {
        BORRADOR: "Borrador",
        SOLICITADO: "Solicitado",
        APROBADO: "Aprobado",
        EN_TRANSITO: "En tránsito",
        RECIBIDO: "Recibido",
        RECIBIDO_PARCIAL: "Recibido parcial",
        ANULADO: "Anulado",
    };

    return etiquetas[estado];
}

function totalSolicitado(traslado: Traslado): number {
    return traslado.detalles.reduce(
        (total, detalle) => total + detalle.cantidadSolicitada,
        0,
    );
}

function totalEnviado(traslado: Traslado): number {
    return traslado.detalles.reduce(
        (total, detalle) => total + detalle.cantidadEnviada,
        0,
    );
}

function totalRecibido(traslado: Traslado): number {
    return traslado.detalles.reduce(
        (total, detalle) => total + detalle.cantidadRecibida,
        0,
    );
}

export default function Traslados() {
    /*
     * Datos temporales para probar la interfaz.
     * Luego el usuario y el rol vendrán del AuthContext.
     */
    //const rolUsuario: RolUsuario = "auxiliar_farmacia";
    const usuarioActualId = 1;

    const [traslados, setTraslados] = useState(trasladosIniciales);
    const [bodega, setBodega] = useState("todas");
    const [estado, setEstado] = useState("todos");
    const [busqueda, setBusqueda] = useState("");

    const [pagina, setPagina] = useState(0);
    const [filasPorPagina, setFilasPorPagina] = useState(10);

    const [trasladoSeleccionadoId, setTrasladoSeleccionadoId] =
        useState<number | null>(null);
    const [accion, setAccion] = useState<
        "despachar" | "recibir" | "discrepancia" | null
    >(null);
    const [cantidadesRecepcion, setCantidadesRecepcion] = useState<
        Record<number, string>
    >({});
    const [motivoDiscrepancia, setMotivoDiscrepancia] = useState("");
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const esAuxiliar = true;
    const esRegente = false;
    //const esAuditor = false;
    //const soloLectura = esAuditor || rolUsuario === "medico" || rolUsuario === "admin";

    const trasladosFiltrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();

        return traslados
            .filter((traslado) => {
                const coincideBodega =
                    bodega === "todas" ||
                    traslado.origen === bodega ||
                    traslado.destino === bodega;

                const coincideEstado =
                    estado === "todos" || traslado.estado === estado;

                const coincideTexto = [
                    traslado.numero,
                    traslado.origen,
                    traslado.destino,
                    traslado.solicitante,
                    ...traslado.detalles.flatMap((detalle) => [
                        detalle.medicamento,
                        detalle.codigo,
                        detalle.lote,
                    ]),
                ].some((valor) => valor.toLowerCase().includes(texto));

                return coincideBodega && coincideEstado && coincideTexto;
            })
            .sort((a, b) => b.fecha.localeCompare(a.fecha));
    }, [traslados, bodega, estado, busqueda]);

    const paginaTraslados = trasladosFiltrados.slice(
        pagina * filasPorPagina,
        pagina * filasPorPagina + filasPorPagina,
    );

    const trasladoSeleccionado = traslados.find(
        (traslado) => traslado.id === trasladoSeleccionadoId,
    );

    const totalSolicitudes = traslados.length;
    const pendientesAprobacion = traslados.filter(
        (traslado) => traslado.estado === "SOLICITADO",
    ).length;
    const enTransito = traslados.filter(
        (traslado) => traslado.estado === "EN_TRANSITO",
    ).length;
    const conDiscrepancias = traslados.filter(
        (traslado) => traslado.estado === "RECIBIDO_PARCIAL",
    ).length;

    function actualizarTraslado(
        id: number,
        actualizacion: Partial<Traslado>,
    ) {
        setTraslados((actuales) =>
            actuales.map((traslado) =>
                traslado.id === id
                    ? { ...traslado, ...actualizacion }
                    : traslado,
            ),
        );
    }

    function aprobarTraslado(traslado: Traslado) {
        setError(null);
        setMensaje(null);

        if (!esRegente) {
            setError("Solo un regente de farmacia puede aprobar traslados.");
            return;
        }

        if (traslado.estado !== "SOLICITADO") {
            setError("Solo se pueden aprobar traslados solicitados.");
            return;
        }

        if (traslado.solicitanteId === usuarioActualId) {
            setError("No puedes aprobar un traslado que tú mismo solicitaste.");
            return;
        }

        actualizarTraslado(traslado.id, {
            estado: "APROBADO",
            aprobadorId: usuarioActualId,
            aprobador: "Regente de farmacia",
        });

        setMensaje(`${traslado.numero} aprobado en la demostración.`);
    }

    function solicitarTraslado(traslado: Traslado) {
        setError(null);
        setMensaje(null);

        if (!esAuxiliar && !esRegente) {
            setError("Tu rol no puede solicitar traslados.");
            return;
        }

        if (traslado.estado !== "BORRADOR") {
            setError("Solo puedes solicitar traslados en borrador.");
            return;
        }

        actualizarTraslado(traslado.id, {
            estado: "SOLICITADO",
        });

        setMensaje(`${traslado.numero} enviado para aprobación.`);
    }

    function abrirAccion(
        traslado: Traslado,
        nuevaAccion: "despachar" | "recibir" | "discrepancia",
    ) {
        setTrasladoSeleccionadoId(traslado.id);
        setAccion(nuevaAccion);
        setCantidadesRecepcion(
            Object.fromEntries(
                traslado.detalles.map((detalle) => [
                    detalle.id,
                    nuevaAccion === "recibir"
                        ? String(
                            detalle.cantidadEnviada -
                            detalle.cantidadRecibida,
                        )
                        : String(detalle.cantidadSolicitada),
                ]),
            ),
        );
        setMotivoDiscrepancia("");
        setError(null);
        setMensaje(null);
    }

    function despacharTraslado() {
        if (!trasladoSeleccionado) return;

        if (
            trasladoSeleccionado.estado !== "APROBADO" ||
            (!esAuxiliar && !esRegente)
        ) {
            setError("No puedes despachar este traslado.");
            return;
        }

        const detallesActualizados =
            trasladoSeleccionado.detalles.map((detalle) => ({
                ...detalle,
                cantidadEnviada: detalle.cantidadSolicitada,
                cantidadRecibida: 0,
            }));

        actualizarTraslado(trasladoSeleccionado.id, {
            estado: "EN_TRANSITO",
            detalles: detallesActualizados,
        });

        setMensaje(
            `${trasladoSeleccionado.numero} marcado como enviado en la demostración.`,
        );
        cerrarDialogo();
    }

    function recibirTraslado() {
        if (!trasladoSeleccionado) return;

        if (
            trasladoSeleccionado.estado !== "EN_TRANSITO" ||
            (!esAuxiliar && !esRegente)
        ) {
            setError("No puedes recibir este traslado.");
            return;
        }

        const detallesActualizados =
            trasladoSeleccionado.detalles.map((detalle) => {
                const recibidoAhora = Number(
                    cantidadesRecepcion[detalle.id] ?? "0",
                );

                return {
                    ...detalle,
                    cantidadRecibida:
                        detalle.cantidadRecibida + recibidoAhora,
                };
            });

        const cantidadesInvalidas = detallesActualizados.some(
            (detalle) =>
                !Number.isInteger(detalle.cantidadRecibida) ||
                detalle.cantidadRecibida < 0 ||
                detalle.cantidadRecibida > detalle.cantidadEnviada,
        );

        if (cantidadesInvalidas) {
            setError(
                "Las cantidades recibidas deben ser enteros no negativos y no pueden superar lo enviado.",
            );
            return;
        }

        const totalEnviadoActualizado = detallesActualizados.reduce(
            (total, detalle) => total + detalle.cantidadEnviada,
            0,
        );
        const totalRecibidoActualizado = detallesActualizados.reduce(
            (total, detalle) => total + detalle.cantidadRecibida,
            0,
        );

        if (totalRecibidoActualizado > totalEnviadoActualizado) {
            setError("No puedes recibir más unidades de las enviadas.");
            return;
        }

        const completo =
            totalRecibidoActualizado === totalEnviadoActualizado;

        actualizarTraslado(trasladoSeleccionado.id, {
            estado: completo ? "RECIBIDO" : "RECIBIDO_PARCIAL",
            detalles: detallesActualizados,
            motivoDiscrepancia: completo
                ? ""
                : "Recepción parcial. Pendiente de conciliación.",
        });

        setMensaje(
            completo
                ? `${trasladoSeleccionado.numero} recibido completamente en la demostración.`
                : `${trasladoSeleccionado.numero} recibido parcialmente. Queda una discrepancia pendiente.`,
        );

        cerrarDialogo();
    }

    function registrarDiscrepancia() {
        if (!trasladoSeleccionado) return;

        if (
            trasladoSeleccionado.estado !== "RECIBIDO_PARCIAL" ||
            (!esAuxiliar && !esRegente)
        ) {
            setError("No puedes registrar esta discrepancia.");
            return;
        }

        if (!motivoDiscrepancia.trim()) {
            setError("Escribe el motivo de la discrepancia.");
            return;
        }

        actualizarTraslado(trasladoSeleccionado.id, {
            motivoDiscrepancia: motivoDiscrepancia.trim(),
        });

        setMensaje(
            `Motivo actualizado para ${trasladoSeleccionado.numero}. La discrepancia continúa pendiente de resolución.`,
        );

        cerrarDialogo();
    }

    function cerrarDialogo() {
        setAccion(null);
        setTrasladoSeleccionadoId(null);
        setCantidadesRecepcion({});
        setMotivoDiscrepancia("");
        setError(null);
    }

    function cambiarBodega(event: SelectChangeEvent) {
        setBodega(event.target.value);
        setPagina(0);
    }

    function cambiarEstado(event: SelectChangeEvent) {
        setEstado(event.target.value);
        setPagina(0);
    }

    function anularBorrador(traslado: Traslado) {
        if (
            traslado.estado !== "BORRADOR" ||
            (!esAuxiliar && !esRegente)
        ) {
            setError("Solo puedes anular un borrador.");
            return;
        }

        actualizarTraslado(traslado.id, {
            estado: "ANULADO",
        });

        setMensaje(`${traslado.numero} anulado en la demostración.`);
        setError(null);
    }

    return (
        <Stack
            spacing={3}
            sx={{ width: "100%", maxWidth: "none", minWidth: 0 }}
        >
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Traslados
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Solicitudes, despacho, recepción y discrepancias entre
                    bodegas.
                </Typography>
            </Box>

            {mensaje && <Alert severity="success">{mensaje}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, minmax(0, 1fr))",
                        lg: "repeat(4, minmax(0, 1fr))",
                    },
                    gap: 2,
                }}
            >
                <Card>
                    <CardContent>
                        <Typography color="text.secondary" variant="body2">
                            Total de traslados
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {totalSolicitudes}
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography color="text.secondary" variant="body2">
                            Pendientes de aprobación
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {pendientesAprobacion}
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography color="text.secondary" variant="body2">
                            En tránsito
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {enTransito}
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography color="text.secondary" variant="body2">
                            Con discrepancias
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color:
                                    conDiscrepancias > 0
                                        ? "warning.main"
                                        : "text.primary",
                            }}
                        >
                            {conDiscrepancias}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            <Card>
                <CardContent>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 2 }}
                    >
                        Listado de traslados
                    </Typography>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        sx={{ mb: 3 }}
                    >
                        <FormControl
                            size="small"
                            sx={{ width: { xs: "100%", sm: "25%" } }}
                        >
                            <InputLabel id="traslado-bodega-label">
                                Bodega
                            </InputLabel>
                            <Select
                                labelId="traslado-bodega-label"
                                value={bodega}
                                label="Bodega"
                                onChange={cambiarBodega}
                            >
                                <MenuItem value="todas">
                                    Todas las bodegas
                                </MenuItem>
                                {bodegasDemo.map((nombre) => (
                                    <MenuItem key={nombre} value={nombre}>
                                        {nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl
                            size="small"
                            sx={{ width: { xs: "100%", sm: "30%" } }}
                        >
                            <InputLabel id="traslado-estado-label">
                                Estado
                            </InputLabel>
                            <Select
                                labelId="traslado-estado-label"
                                value={estado}
                                label="Estado"
                                onChange={cambiarEstado}
                            >
                                <MenuItem value="todos">Todos los estados</MenuItem>
                                {estadosTraslado.map((valor) => (
                                    <MenuItem key={valor} value={valor}>
                                        {etiquetaEstado(valor)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            size="small"
                            label="Buscar traslado o medicamento"
                            value={busqueda}
                            onChange={(event) => {
                                setBusqueda(event.target.value);
                                setPagina(0);
                            }}
                            sx={{ flex: 1, minWidth: 0 }}
                        />
                    </Stack>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Traslado</TableCell>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell>Origen</TableCell>
                                    <TableCell>Destino</TableCell>
                                    <TableCell>Solicitante</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell align="right">
                                        Solicitado
                                    </TableCell>
                                    <TableCell align="right">
                                        Enviado
                                    </TableCell>
                                    <TableCell align="right">
                                        Recibido
                                    </TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {paginaTraslados.map((traslado) => {
                                    const puedeAprobar =
                                        esRegente &&
                                        traslado.estado === "SOLICITADO" &&
                                        traslado.solicitanteId !==
                                        usuarioActualId;

                                    const puedeSolicitar =
                                        (esAuxiliar || esRegente) &&
                                        traslado.estado === "BORRADOR";

                                    const puedeDespachar =
                                        (esAuxiliar || esRegente) &&
                                        traslado.estado === "APROBADO";

                                    const puedeRecibir =
                                        (esAuxiliar || esRegente) &&
                                        traslado.estado === "EN_TRANSITO";

                                    const puedeInformarDiscrepancia =
                                        (esAuxiliar || esRegente) &&
                                        traslado.estado ===
                                        "RECIBIDO_PARCIAL";

                                    return (
                                        <TableRow key={traslado.id} hover>
                                            <TableCell>
                                                <Typography
                                                    sx={{ fontWeight: 600 }}
                                                >
                                                    {traslado.numero}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {traslado.detalles.length}{" "}
                                                    medicamento(s)
                                                </Typography>
                                            </TableCell>

                                            <TableCell>{traslado.fecha}</TableCell>
                                            <TableCell>{traslado.origen}</TableCell>
                                            <TableCell>{traslado.destino}</TableCell>
                                            <TableCell>{traslado.solicitante}</TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={etiquetaEstado(
                                                        traslado.estado,
                                                    )}
                                                    color={colorEstado(
                                                        traslado.estado,
                                                    )}
                                                    size="small"
                                                />
                                            </TableCell>

                                            <TableCell align="right">
                                                {totalSolicitado(traslado)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {totalEnviado(traslado)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {totalRecibido(traslado)}
                                            </TableCell>

                                            <TableCell>
                                                <Stack
                                                    spacing={1}
                                                    sx={{
                                                        alignItems: "flex-start",
                                                    }}
                                                >
                                                    <Button
                                                        size="small"
                                                        onClick={() => {
                                                            setTrasladoSeleccionadoId(
                                                                traslado.id,
                                                            );
                                                            setAccion(null);
                                                        }}
                                                    >
                                                        Ver detalle
                                                    </Button>

                                                    {puedeSolicitar && (
                                                        <Button
                                                            size="small"
                                                            onClick={() =>
                                                                solicitarTraslado(
                                                                    traslado,
                                                                )
                                                            }
                                                        >
                                                            Solicitar
                                                        </Button>
                                                    )}

                                                    {puedeAprobar && (
                                                        <Button
                                                            size="small"
                                                            onClick={() =>
                                                                aprobarTraslado(
                                                                    traslado,
                                                                )
                                                            }
                                                        >
                                                            Aprobar
                                                        </Button>
                                                    )}

                                                    {puedeDespachar && (
                                                        <Button
                                                            size="small"
                                                            onClick={() =>
                                                                abrirAccion(
                                                                    traslado,
                                                                    "despachar",
                                                                )
                                                            }
                                                        >
                                                            Despachar
                                                        </Button>
                                                    )}

                                                    {puedeRecibir && (
                                                        <Button
                                                            size="small"
                                                            onClick={() =>
                                                                abrirAccion(
                                                                    traslado,
                                                                    "recibir",
                                                                )
                                                            }
                                                        >
                                                            Recibir
                                                        </Button>
                                                    )}

                                                    {puedeInformarDiscrepancia && (
                                                        <Button
                                                            size="small"
                                                            color="warning"
                                                            onClick={() =>
                                                                abrirAccion(
                                                                    traslado,
                                                                    "discrepancia",
                                                                )
                                                            }
                                                        >
                                                            Discrepancia
                                                        </Button>
                                                    )}

                                                    {puedeSolicitar && (
                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            onClick={() =>
                                                                anularBorrador(
                                                                    traslado,
                                                                )
                                                            }
                                                        >
                                                            Anular
                                                        </Button>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                                {paginaTraslados.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center">
                                            No se encontraron traslados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={trasladosFiltrados.length}
                        page={pagina}
                        rowsPerPage={filasPorPagina}
                        onPageChange={(_, nuevaPagina) =>
                            setPagina(nuevaPagina)
                        }
                        onRowsPerPageChange={(event) => {
                            setFilasPorPagina(Number(event.target.value));
                            setPagina(0);
                        }}
                        rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage="Filas por página:"
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}-${to} de ${count}`
                        }
                    />
                </CardContent>
            </Card>

            <Dialog
                open={trasladoSeleccionado !== undefined && accion === null}
                onClose={cerrarDialogo}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    Detalle del traslado {trasladoSeleccionado?.numero}
                </DialogTitle>

                <DialogContent>
                    {trasladoSeleccionado && (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <Typography>
                                <strong>Origen:</strong>{" "}
                                {trasladoSeleccionado.origen}
                            </Typography>
                            <Typography>
                                <strong>Destino:</strong>{" "}
                                {trasladoSeleccionado.destino}
                            </Typography>
                            <Typography>
                                <strong>Solicitante:</strong>{" "}
                                {trasladoSeleccionado.solicitante}
                            </Typography>
                            <Typography>
                                <strong>Aprobador:</strong>{" "}
                                {trasladoSeleccionado.aprobador ?? "Pendiente"}
                            </Typography>

                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Medicamento</TableCell>
                                            <TableCell>Lote</TableCell>
                                            <TableCell align="right">
                                                Solicitado
                                            </TableCell>
                                            <TableCell align="right">
                                                Enviado
                                            </TableCell>
                                            <TableCell align="right">
                                                Recibido
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {trasladoSeleccionado.detalles.map(
                                            (detalle) => (
                                                <TableRow key={detalle.id}>
                                                    <TableCell>
                                                        {detalle.medicamento}
                                                    </TableCell>
                                                    <TableCell>
                                                        {detalle.lote}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {detalle.cantidadSolicitada}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {detalle.cantidadEnviada}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {detalle.cantidadRecibida}
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {trasladoSeleccionado.motivoDiscrepancia && (
                                <Alert severity="warning">
                                    <strong>Discrepancia:</strong>{" "}
                                    {trasladoSeleccionado.motivoDiscrepancia}
                                </Alert>
                            )}
                        </Stack>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={cerrarDialogo}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={accion !== null}
                onClose={cerrarDialogo}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {accion === "despachar" && "Confirmar despacho"}
                    {accion === "recibir" && "Registrar recepción"}
                    {accion === "discrepancia" && "Registrar discrepancia"}
                </DialogTitle>

                <DialogContent>
                    {trasladoSeleccionado && accion === "despachar" && (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <Alert severity="warning">
                                Al despachar, las existencias se descontarían
                                de la bodega de origen. Esta demostración no
                                modifica el inventario real.
                            </Alert>

                            {trasladoSeleccionado.detalles.map((detalle) => (
                                <Box key={detalle.id}>
                                    <Typography sx={{ fontWeight: 600 }}>
                                        {detalle.medicamento}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Lote {detalle.lote} · Cantidad a enviar:{" "}
                                        {detalle.cantidadSolicitada}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    )}

                    {trasladoSeleccionado && accion === "recibir" && (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <Alert severity="info">
                                Registra la cantidad recibida por lote.
                                Si es menor que la enviada, el traslado
                                quedará con una discrepancia pendiente.
                            </Alert>

                            {trasladoSeleccionado.detalles.map((detalle) => (
                                <Stack
                                    key={detalle.id}
                                    direction="row"
                                    spacing={2}
                                    sx={{
                                        alignItems: "center",
                                    }}
                                >
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontWeight: 600 }}>
                                            {detalle.medicamento}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Lote {detalle.lote} · Por recibir:{" "}
                                            {detalle.cantidadEnviada -
                                                detalle.cantidadRecibida}
                                        </Typography>
                                    </Box>

                                    <TextField
                                        type="number"
                                        size="small"
                                        label="Recibido ahora"
                                        value={
                                            cantidadesRecepcion[detalle.id] ??
                                            "0"
                                        }
                                        onChange={(event) =>
                                            setCantidadesRecepcion((actuales) => ({
                                                ...actuales,
                                                [detalle.id]: event.target.value,
                                            }))
                                        }
                                        slotProps={{
                                            htmlInput: {
                                                min: 0,
                                                max:
                                                    detalle.cantidadEnviada -
                                                    detalle.cantidadRecibida,
                                                step: 1,
                                            },
                                        }}
                                        sx={{ width: 150 }}
                                    />
                                </Stack>
                            ))}
                        </Stack>
                    )}

                    {trasladoSeleccionado && accion === "discrepancia" && (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <Alert severity="warning">
                                Documenta la diferencia encontrada. Registrar
                                el motivo no cierra ni resuelve por sí solo
                                la discrepancia.
                            </Alert>

                            <TextField
                                label="Motivo de la discrepancia"
                                multiline
                                minRows={3}
                                value={motivoDiscrepancia}
                                onChange={(event) =>
                                    setMotivoDiscrepancia(event.target.value)
                                }
                                placeholder="Ej.: se recibieron menos unidades de las enviadas..."
                                fullWidth
                            />
                        </Stack>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={cerrarDialogo}>Cancelar</Button>

                    {accion === "despachar" && (
                        <Button
                            variant="contained"
                            onClick={despacharTraslado}
                        >
                            Confirmar despacho
                        </Button>
                    )}

                    {accion === "recibir" && (
                        <Button
                            variant="contained"
                            onClick={recibirTraslado}
                        >
                            Registrar recepción
                        </Button>
                    )}

                    {accion === "discrepancia" && (
                        <Button
                            variant="contained"
                            onClick={registrarDiscrepancia}
                        >
                            Guardar motivo
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
