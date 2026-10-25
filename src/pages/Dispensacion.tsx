import { useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
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
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

type RolUsuario =
    | "auxiliar_farmacia"
    | "regente_farmacia"
    | "medico"
    | "auditor"
    | "admin";

type LoteDisponible = {
    id: number;
    codigo: string;
    vencimiento: string;
    existencia: number;
};

type MedicamentoPrescrito = {
    id: number;
    medicamento: string;
    codigo: string;
    cantidadPrescrita: number;
    cantidadDispensada: number;
    controlEspecial: boolean;
    lotes: LoteDisponible[];
};

type Prescripcion = {
    id: number;
    numero: string;
    pacienteId: number;
    fecha: string;
    medicamentos: MedicamentoPrescrito[];
};

type Paciente = {
    id: number;
    identificacion: string;
    nombre: string;
};

type DetalleDispensacion = {
    medicamentoId: number;
    cantidad: number;
};

const pacientesDemo: Paciente[] = [
    {
        id: 1,
        identificacion: "PAC-001",
        nombre: "Carlos Ramírez",
    },
    {
        id: 2,
        identificacion: "PAC-002",
        nombre: "María González",
    },
    {
        id: 3,
        identificacion: "PAC-003",
        nombre: "Andrés Martínez",
    },
];

const prescripcionesDemo: Prescripcion[] = [
    {
        id: 101,
        numero: "PRE-2026-001",
        pacienteId: 1,
        fecha: "2026-10-20",
        medicamentos: [
            {
                id: 1,
                medicamento: "Acetaminofén 500 mg",
                codigo: "MED-001",
                cantidadPrescrita: 20,
                cantidadDispensada: 5,
                controlEspecial: false,
                lotes: [
                    {
                        id: 11,
                        codigo: "AC-2026-01",
                        vencimiento: "2026-11-15",
                        existencia: 12,
                    },
                    {
                        id: 12,
                        codigo: "AC-2027-02",
                        vencimiento: "2027-06-30",
                        existencia: 100,
                    },
                ],
            },
            {
                id: 2,
                medicamento: "Ibuprofeno 400 mg",
                codigo: "MED-003",
                cantidadPrescrita: 10,
                cantidadDispensada: 0,
                controlEspecial: false,
                lotes: [
                    {
                        id: 21,
                        codigo: "IB-2026-02",
                        vencimiento: "2027-03-20",
                        existencia: 8,
                    },
                    {
                        id: 22,
                        codigo: "IB-2026-05",
                        vencimiento: "2027-08-15",
                        existencia: 40,
                    },
                ],
            },
        ],
    },
    {
        id: 102,
        numero: "PRE-2026-002",
        pacienteId: 2,
        fecha: "2026-10-22",
        medicamentos: [
            {
                id: 3,
                medicamento: "Clonazepam 0.5 mg",
                codigo: "MED-002",
                cantidadPrescrita: 10,
                cantidadDispensada: 2,
                controlEspecial: true,
                lotes: [
                    {
                        id: 31,
                        codigo: "CL-2026-04",
                        vencimiento: "2027-06-30",
                        existencia: 30,
                    },
                ],
            },
        ],
    },
];

const bodegasDemo = [
    "Bodega principal",
    "Bodega secundaria",
];

const regentesDemo = [
    { id: 3, nombre: "Regente de farmacia" },
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

function obtenerLotesVigentes(
    medicamento: MedicamentoPrescrito,
): LoteDisponible[] {
    return medicamento.lotes
        .filter(
            (lote) =>
                diasParaVencer(lote.vencimiento) >= 0 &&
                lote.existencia > 0,
        )
        .sort((a, b) =>
            a.vencimiento.localeCompare(b.vencimiento),
        );
}

export default function Dispensacion() {
    /*
     * Temporal: simula al usuario autenticado.
     * Después se obtendrá del contexto de autenticación.
     */
    const rolUsuario: RolUsuario = "auxiliar_farmacia";
    const usuarioActualId = 1;

    const [pacienteId, setPacienteId] = useState("");
    const [prescripcionId, setPrescripcionId] = useState("");
    const [bodega, setBodega] = useState("Bodega principal");
    const [regenteId, setRegenteId] = useState("");
    const [cantidades, setCantidades] = useState<
        Record<number, string>
    >({});
    const [confirmacionVisible, setConfirmacionVisible] =
        useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);

    const puedeDispensar =
        rolUsuario === "auxiliar_farmacia" ||
        rolUsuario === "regente_farmacia";

    const pacienteSeleccionado = pacientesDemo.find(
        (paciente) => String(paciente.id) === pacienteId,
    );

    const prescripcionesPaciente = prescripcionesDemo.filter(
        (prescripcion) =>
            String(prescripcion.pacienteId) === pacienteId,
    );

    const prescripcionSeleccionada = prescripcionesDemo.find(
        (prescripcion) =>
            String(prescripcion.id) === prescripcionId &&
            String(prescripcion.pacienteId) === pacienteId,
    );

    const detalles = useMemo<DetalleDispensacion[]>(() => {
        if (!prescripcionSeleccionada) return [];

        return prescripcionSeleccionada.medicamentos
            .map((medicamento) => ({
                medicamentoId: medicamento.id,
                cantidad: Number(
                    cantidades[medicamento.id] ?? "0",
                ),
            }))
            .filter(
                (detalle) =>
                    Number.isFinite(detalle.cantidad) &&
                    detalle.cantidad > 0,
            );
    }, [prescripcionSeleccionada, cantidades]);

    const validaciones = useMemo(() => {
        const errores: string[] = [];

        if (!pacienteId) {
            errores.push("Selecciona un paciente.");
        }

        if (!prescripcionSeleccionada) {
            errores.push("Selecciona una prescripción.");
        }

        if (!bodega) {
            errores.push("Selecciona una bodega.");
        }

        if (!prescripcionSeleccionada) {
            return errores;
        }

        const medicamentosSolicitados =
            prescripcionSeleccionada.medicamentos.filter(
                (medicamento) =>
                    Number(cantidades[medicamento.id] ?? "0") > 0,
            );

        if (medicamentosSolicitados.length === 0) {
            errores.push(
                "Ingresa una cantidad mayor que cero para al menos un medicamento.",
            );
        }

        for (const medicamento of medicamentosSolicitados) {
            const cantidad = Number(
                cantidades[medicamento.id] ?? "0",
            );

            const pendiente =
                medicamento.cantidadPrescrita -
                medicamento.cantidadDispensada;

            const lotesVigentes = obtenerLotesVigentes(medicamento);
            const existenciaDisponible = lotesVigentes.reduce(
                (total, lote) => total + lote.existencia,
                0,
            );

            if (!Number.isInteger(cantidad) || cantidad <= 0) {
                errores.push(
                    `${medicamento.medicamento}: la cantidad debe ser un entero positivo.`,
                );
                continue;
            }

            if (cantidad > pendiente) {
                errores.push(
                    `${medicamento.medicamento}: la cantidad supera las ${pendiente} unidades pendientes de la prescripción.`,
                );
            }

            if (cantidad > existenciaDisponible) {
                errores.push(
                    `${medicamento.medicamento}: solo hay ${existenciaDisponible} unidades disponibles en lotes vigentes.`,
                );
            }

            if (
                medicamento.controlEspecial &&
                !regenteId
            ) {
                errores.push(
                    `${medicamento.medicamento}: requiere autorización de un segundo regente.`,
                );
            }

            if (
                medicamento.controlEspecial &&
                Number(regenteId) === usuarioActualId
            ) {
                errores.push(
                    `${medicamento.medicamento}: el autorizador debe ser distinto del usuario que dispensa.`,
                );
            }
        }

        if (
            fechaInvalida(fechaDesdePrescripcion(prescripcionSeleccionada.fecha))
        ) {
            errores.push("La fecha de la prescripción no es válida.");
        }

        return errores;
    }, [
        pacienteId,
        prescripcionSeleccionada,
        cantidades,
        bodega,
        regenteId,
        usuarioActualId,
    ]);

    const cantidadTotal = detalles.reduce(
        (total, detalle) => total + detalle.cantidad,
        0,
    );

    function cambiarPaciente(event: SelectChangeEvent) {
        setPacienteId(event.target.value);
        setPrescripcionId("");
        setCantidades({});
        setRegenteId("");
        setConfirmacionVisible(false);
        setMensaje(null);
    }

    function cambiarPrescripcion(event: SelectChangeEvent) {
        setPrescripcionId(event.target.value);
        setCantidades({});
        setRegenteId("");
        setConfirmacionVisible(false);
        setMensaje(null);
    }

    function cambiarCantidad(
        medicamentoId: number,
        valor: string,
    ) {
        setCantidades((actuales) => ({
            ...actuales,
            [medicamentoId]: valor,
        }));
        setConfirmacionVisible(false);
        setMensaje(null);
    }

    function prepararConfirmacion() {
        setMensaje(null);

        if (validaciones.length > 0) {
            setConfirmacionVisible(false);
            return;
        }

        setConfirmacionVisible(true);
    }

    function confirmarDispensacionDemo() {
        /*
         * No registra movimientos reales.
         * La operación real deberá ser transaccional en Laravel,
         * validar permisos, stock, FEFO, autorización e idempotencia.
         */
        setMensaje(
            "Vista previa validada. Aún no se registró la dispensación porque el backend no está conectado.",
        );
        setConfirmacionVisible(false);
    }

    if (!puedeDispensar) {
        return (
            <Stack spacing={2} sx={{ width: "100%" }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Dispensación
                </Typography>
                <Alert severity="error">
                    Tu rol no tiene permiso para realizar dispensaciones.
                    La autorización definitiva también debe aplicarse en
                    el backend.
                </Alert>
            </Stack>
        );
    }

    return (
        <Stack
            spacing={3}
            sx={{ width: "100%", maxWidth: "none", minWidth: 0 }}
        >
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Dispensación
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Dispensación de medicamentos asociados a una
                    prescripción médica.
                </Typography>
            </Box>

            <Alert severity="info">
                Modo de demostración: no se modifica el inventario ni se
                registra información clínica real.
            </Alert>

            {mensaje && (
                <Alert severity="success">{mensaje}</Alert>
            )}

            <Card>
                <CardContent>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 2 }}
                    >
                        Paciente y prescripción
                    </Typography>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                    >
                        <FormControl
                            size="small"
                            sx={{ width: { xs: "100%", sm: "35%" } }}
                        >
                            <InputLabel id="disp-paciente-label">
                                Paciente
                            </InputLabel>
                            <Select
                                labelId="disp-paciente-label"
                                value={pacienteId}
                                label="Paciente"
                                onChange={cambiarPaciente}
                            >
                                {pacientesDemo.map((paciente) => (
                                    <MenuItem
                                        key={paciente.id}
                                        value={String(paciente.id)}
                                    >
                                        {paciente.nombre} (
                                        {paciente.identificacion})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl
                            size="small"
                            disabled={!pacienteId}
                            sx={{ width: { xs: "100%", sm: "35%" } }}
                        >
                            <InputLabel id="disp-prescripcion-label">
                                Prescripción
                            </InputLabel>
                            <Select
                                labelId="disp-prescripcion-label"
                                value={prescripcionId}
                                label="Prescripción"
                                onChange={cambiarPrescripcion}
                            >
                                {prescripcionesPaciente.map(
                                    (prescripcion) => (
                                        <MenuItem
                                            key={prescripcion.id}
                                            value={String(prescripcion.id)}
                                        >
                                            {prescripcion.numero} —{" "}
                                            {prescripcion.fecha}
                                        </MenuItem>
                                    ),
                                )}
                            </Select>
                        </FormControl>

                        <FormControl
                            size="small"
                            sx={{ width: { xs: "100%", sm: "30%" } }}
                        >
                            <InputLabel id="disp-bodega-label">
                                Bodega
                            </InputLabel>
                            <Select
                                labelId="disp-bodega-label"
                                value={bodega}
                                label="Bodega"
                                onChange={(event) => {
                                    setBodega(event.target.value);
                                    setConfirmacionVisible(false);
                                }}
                            >
                                {bodegasDemo.map((nombreBodega) => (
                                    <MenuItem
                                        key={nombreBodega}
                                        value={nombreBodega}
                                    >
                                        {nombreBodega}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>

                    {pacienteSeleccionado &&
                        prescripcionSeleccionada && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Paciente: {pacienteSeleccionado.nombre}.
                                Prescripción:{" "}
                                {prescripcionSeleccionada.numero}.
                                Fecha: {prescripcionSeleccionada.fecha}.
                            </Alert>
                        )}
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 1 }}
                    >
                        Medicamentos prescritos
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        Ingresa la cantidad que se dispensará en esta
                        operación. Puedes realizar dispensaciones parciales
                        sin superar el saldo pendiente.
                    </Typography>

                    {!prescripcionSeleccionada ? (
                        <Alert severity="info">
                            Selecciona un paciente y una prescripción para
                            consultar los medicamentos.
                        </Alert>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Medicamento</TableCell>
                                        <TableCell align="right">
                                            Prescrito
                                        </TableCell>
                                        <TableCell align="right">
                                            Dispensado
                                        </TableCell>
                                        <TableCell align="right">
                                            Pendiente
                                        </TableCell>
                                        <TableCell>Existencia vigente</TableCell>
                                        <TableCell>
                                            Cantidad a dispensar
                                        </TableCell>
                                        <TableCell>Control especial</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {prescripcionSeleccionada.medicamentos.map(
                                        (medicamento) => {
                                            const pendiente =
                                                medicamento.cantidadPrescrita -
                                                medicamento.cantidadDispensada;

                                            const lotesVigentes =
                                                obtenerLotesVigentes(
                                                    medicamento,
                                                );

                                            const existenciaDisponible =
                                                lotesVigentes.reduce(
                                                    (total, lote) =>
                                                        total + lote.existencia,
                                                    0,
                                                );

                                            const cantidad = Number(
                                                cantidades[medicamento.id] ??
                                                "0",
                                            );

                                            const superaPendiente =
                                                cantidad > pendiente;

                                            return (
                                                <TableRow
                                                    key={medicamento.id}
                                                    hover
                                                >
                                                    <TableCell>
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {
                                                                medicamento.medicamento
                                                            }
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            {medicamento.codigo}
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        {
                                                            medicamento.cantidadPrescrita
                                                        }
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        {
                                                            medicamento.cantidadDispensada
                                                        }
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 600,
                                                                color:
                                                                    pendiente > 0
                                                                        ? "primary.main"
                                                                        : "success.main",
                                                            }}
                                                        >
                                                            {pendiente}
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Typography>
                                                            {existenciaDisponible}
                                                        </Typography>
                                                        {lotesVigentes.map(
                                                            (lote) => (
                                                                <Typography
                                                                    key={lote.id}
                                                                    variant="caption"
                                                                    sx={{
                                                                        display: "block",
                                                                        color: "text.secondary",
                                                                    }}
                                                                >
                                                                    {lote.codigo}:
                                                                    {" "}
                                                                    {lote.existencia}
                                                                    {" · "}
                                                                    Vence{" "}
                                                                    {lote.vencimiento}
                                                                </Typography>
                                                            ),
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            size="small"
                                                            value={
                                                                cantidades[
                                                                medicamento.id
                                                                ] ?? ""
                                                            }
                                                            onChange={(event) =>
                                                                cambiarCantidad(
                                                                    medicamento.id,
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            slotProps={{
                                                                htmlInput: {
                                                                    min: 0,
                                                                    max: Math.min(
                                                                        pendiente,
                                                                        existenciaDisponible,
                                                                    ),
                                                                    step: 1,
                                                                },
                                                            }}
                                                            error={
                                                                superaPendiente
                                                            }
                                                            helperText={
                                                                superaPendiente
                                                                    ? `Máximo: ${pendiente}`
                                                                    : ""
                                                            }
                                                            sx={{
                                                                width: 130,
                                                            }}
                                                        />
                                                    </TableCell>

                                                    <TableCell>
                                                        {medicamento.controlEspecial ? (
                                                            <Chip
                                                                label="Requiere autorización"
                                                                color="warning"
                                                                size="small"
                                                            />
                                                        ) : (
                                                            <Chip
                                                                label="No"
                                                                color="default"
                                                                size="small"
                                                            />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        },
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            {prescripcionSeleccionada &&
                prescripcionSeleccionada.medicamentos.some(
                    (medicamento) =>
                        medicamento.controlEspecial &&
                        Number(cantidades[medicamento.id] ?? "0") > 0,
                ) && (
                    <Card>
                        <CardContent>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 600, mb: 1 }}
                            >
                                Autorización de control especial
                            </Typography>

                            <Alert severity="warning" sx={{ mb: 2 }}>
                                La dispensación de estos medicamentos
                                requiere la autorización de un segundo
                                usuario con rol regente de farmacia.
                            </Alert>

                            <FormControl
                                size="small"
                                sx={{ width: { xs: "100%", sm: 360 } }}
                            >
                                <InputLabel id="disp-regente-label">
                                    Regente autorizador
                                </InputLabel>
                                <Select
                                    labelId="disp-regente-label"
                                    value={regenteId}
                                    label="Regente autorizador"
                                    onChange={(event) => {
                                        setRegenteId(event.target.value);
                                        setConfirmacionVisible(false);
                                    }}
                                >
                                    {regentesDemo
                                        .filter(
                                            (regente) =>
                                                regente.id !== usuarioActualId,
                                        )
                                        .map((regente) => (
                                            <MenuItem
                                                key={regente.id}
                                                value={String(regente.id)}
                                            >
                                                {regente.nombre}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    display: "block",
                                    mt: 1,
                                }}
                            >
                                En producción, la identidad, el rol y la
                                autorización deben verificarse en el backend.
                                No basta con seleccionar un nombre.
                            </Typography>
                        </CardContent>
                    </Card>
                )}

            <Card>
                <CardContent>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 2 }}
                    >
                        Resumen de dispensación
                    </Typography>

                    <Stack
                        sx={{
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "stretch", sm: "center" },
                            justifyContent: "space-between",
                            gap: 2,
                        }}
                    >
                        <Box>
                            <Typography color="text.secondary" variant="body2">
                                Medicamentos incluidos
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                {detalles.length}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography color="text.secondary" variant="body2">
                                Unidades solicitadas
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                {cantidadTotal}
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            disabled={
                                !prescripcionSeleccionada ||
                                detalles.length === 0
                            }
                            onClick={prepararConfirmacion}
                        >
                            Revisar dispensación
                        </Button>
                    </Stack>

                    {validaciones.length > 0 &&
                        prescripcionSeleccionada && (
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                <Typography
                                    component="div"
                                    sx={{ fontWeight: 600, mb: 0.5 }}
                                >
                                    Revisa antes de continuar:
                                </Typography>
                                <Box component="ul" sx={{ mt: 0, mb: 0, pl: 2 }}>
                                    {validaciones.map((validacion) => (
                                        <li key={validacion}>{validacion}</li>
                                    ))}
                                </Box>
                            </Alert>
                        )}

                    {confirmacionVisible && (
                        <Box
                            sx={{
                                mt: 3,
                                p: 2,
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 2,
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600 }}
                            >
                                Confirmar operación de demostración
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ my: 1 }}
                            >
                                Se solicitarían {cantidadTotal} unidades
                                para la prescripción{" "}
                                {prescripcionSeleccionada?.numero}. En la
                                versión actual no se guarda ni se descuenta
                                inventario.
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                            >
                                <Button
                                    variant="contained"
                                    onClick={confirmarDispensacionDemo}
                                >
                                    Confirmar vista previa
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        setConfirmacionVisible(false)
                                    }
                                >
                                    Volver a revisar
                                </Button>
                            </Stack>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Stack>
    );
}

function fechaInvalida(fecha: string): boolean {
    return Number.isNaN(Date.parse(fecha));
}

function fechaDesdePrescripcion(fecha: string): string {
    return fecha;
}
