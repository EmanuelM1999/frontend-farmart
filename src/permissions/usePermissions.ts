
import { useAuth } from "../context/AuthContext";
import { permisosPorRol } from "./permissionsByRole";
import type { Permiso } from "./permissions";

export function usePermissions() {
    const { usuario } = useAuth();

    const can = (permiso: Permiso): boolean => {
        if (!usuario) return false;

        return permisosPorRol[usuario.rol].includes(permiso);
    };

    return { can };
}
