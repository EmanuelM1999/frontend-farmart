import api from "./api";
import type { RespuestaKardex } from "../types/kardex.types";

export interface FiltrosKardex {
    page?: number;
    per_page?: number;
}

export const kardexService = {
    async listar(
        filtros: FiltrosKardex = {}
    ): Promise<RespuestaKardex> {
        const { data } = await api.get<RespuestaKardex>("/kardex", {
            params: filtros,
        });

        return data;
    },
};