import type { RolUsuario } from "../services/auth.service";

export const rolesPorRuta: Record<string, RolUsuario[]> = {
  "/dispensacion": ["auxiliar_farmacia", "regente_farmacia"],
  "/traslados": ["auxiliar_farmacia", "regente_farmacia"],
  "/inventario": ["auxiliar_farmacia", "regente_farmacia", "auditor"],
  "/kardex": ["auxiliar_farmacia", "regente_farmacia", "auditor"],
};

export type RutaConPermisos = keyof typeof rolesPorRuta;