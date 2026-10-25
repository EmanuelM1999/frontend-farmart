export interface MovimientoKardex {
    id: number;
    tipo_movimiento: string;
    cantidad: number;
    motivo: string;
    created_at: string;
    usuario: {
        id: number;
        nombre: string;
        email: string;
    };
    existencia: {
        id: number;
        cantidad_actual: number;
        bodega: {
            id: number;
            codigo: string;
            nombre: string;
        };
        medicamento: {
            id: number;
            codigo: string;
            nombre: string;
        };
        lote: {
            id: number;
            codigo: string;
            fecha_vencimiento: string;
        };
    };
}

export interface PaginacionKardex {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

export interface RespuestaKardex {
    data: MovimientoKardex[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: PaginacionKardex;
}
