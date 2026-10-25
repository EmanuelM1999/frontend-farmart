import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    authService,
    type CredencialesLogin,
    type Usuario,
} from "../services/auth.service";

interface AuthContextType {
    usuario: Usuario | null;
    autenticado: boolean;
    cargando: boolean;
    iniciarSesion: (credenciales: CredencialesLogin) => Promise<void>;
    cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [cargando, setCargando] = useState(true);

    const cerrarSesion = useCallback(async () => {
        try {
            await authService.logout();
        } finally {
            setUsuario(null);
        }
    }, []);

    const iniciarSesion = useCallback(
        async (credenciales: CredencialesLogin) => {
            const usuarioAutenticado = await authService.login(credenciales);
            setUsuario(usuarioAutenticado);
        },
        [],
    );

    useEffect(() => {
        let activo = true;

        const restaurarSesion = async () => {
            const token = authService.obtenerToken();

            if (!token) {
                if (activo) setCargando(false);
                return;
            }

            try {
                const usuarioActual = await authService.obtenerUsuario();

                if (activo) setUsuario(usuarioActual);
            } catch {
                authService.eliminarToken();

                if (activo) setUsuario(null);
            } finally {
                if (activo) setCargando(false);
            }
        };

        void restaurarSesion();

        return () => {
            activo = false;
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                usuario,
                autenticado: usuario !== null,
                cargando,
                iniciarSesion,
                cerrarSesion,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const contexto = useContext(AuthContext);

    if (!contexto) {
        throw new Error("useAuth debe utilizarse dentro de AuthProvider.");
    }

    return contexto;
}