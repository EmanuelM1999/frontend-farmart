
import api from "./api";

export interface InventarioItem {
    id: number;
    cantidad: number;
    bodega: {
        id: number;
        codigo: string;
        nombre: string;
    };
    medicamento: {
        id: number;
        codigo: string;
        nombre: string;
        unidad_medida: string;
        control_especial: boolean;
    };
    lote: {
        id: number;
        codigo: string;
        fecha_vencimiento: string;
    };
}

export interface InventarioResponse {
    data: InventarioItem[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export const inventarioService = {
    async listar(
        bodegaId?: number,
        page = 1,
        perPage = 10,
    ): Promise<InventarioResponse> {
        const { data } = await api.get<InventarioResponse>(
            "/inventario",
            {
                params: {
                    ...(bodegaId !== undefined && {
                        bodega_id: bodegaId,
                    }),
                    page,
                    per_page: perPage,
                },
            },
        );

        return data;
    },
};
