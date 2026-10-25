
export const PERMISOS = {
    GESTIONAR_USUARIOS: "gestionar-usuarios",
    GESTIONAR_CATALOGOS: "gestionar-catalogos",
    CONSULTAR_INVENTARIO: "consultar-inventario",
    DISPENSAR_MEDICAMENTOS: "dispensar-medicamentos",
    CREAR_TRASLADOS: "crear-traslados",
    RECIBIR_TRASLADOS: "recibir-traslados",
    APROBAR_TRASLADOS: "aprobar-traslados",
    AUTORIZAR_CONTROL_ESPECIAL: "autorizar-control-especial",
    AJUSTAR_INVENTARIO: "ajustar-inventario",
    CREAR_PRESCRIPCIONES: "crear-prescripciones",
    CONSULTAR_PACIENTES: "consultar-pacientes",
    CONSULTAR_KARDEX: "consultar-kardex",
    DESPACHAR_TRASLADOS: "despachar-traslados",
    ANULAR_TRASLADOS: "anular-traslados",
} as const;

export type Permiso =
    (typeof PERMISOS)[keyof typeof PERMISOS];
