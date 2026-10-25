import api from "./api";

export type RolUsuario =
    | "auxiliar_farmacia"
    | "regente_farmacia"
    | "medico"
    | "auditor"
    | "admin";

export interface Usuario {
    id: number;
    name: string;
    email: string;
    rol: RolUsuario;
}

interface LoginResponse {
    message: string;
    token: string;
    user: Usuario;
}

export interface CredencialesLogin {
    email: string;
    password: string;
}

const TOKEN_KEY = "farmart_token";

export const authService = {
    async login(credenciales: CredencialesLogin): Promise<Usuario> {
        const { data } = await api.post<LoginResponse>(
            "/login",
            credenciales,
        );

        localStorage.setItem(TOKEN_KEY, data.token);

        return data.user;
    },

    async obtenerUsuario(): Promise<Usuario> {
        const { data } = await api.get<Usuario>("/user");
        return data;
    },

    async logout(): Promise<void> {
        try {
            await api.post("/logout");
        } finally {
            localStorage.removeItem(TOKEN_KEY);
        }
    },

    obtenerToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    },

    eliminarToken(): void {
        localStorage.removeItem(TOKEN_KEY);
    },
};
