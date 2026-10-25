import { Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login";
import Inventario from "./pages/Inventario";
import Kardex from "./pages/Kardex";
import Traslados from "./pages/Traslados";
import Dispensacion from "./pages/Dispensacion";
import AccesoDenegado from "./pages/AccesoDenegado";

// Conserva el import y el layout que ya existen en tu proyecto.
import DashboardLayout from "./layouts/DashboardLayout";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Login público */}
        <Route path="/login" element={<Login />} />

        {/* Página pública para usuarios sin permisos */}
        <Route
          path="/acceso-denegado"
          element={<AccesoDenegado />}
        />

        {/* Rutas autenticadas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Ruta inicial del dashboard */}
            <Route
              index
              element={<Navigate to="/inventario" replace />}
            />

            {/* Auxiliar y regente */}
            <Route
              element={
                <ProtectedRoute
                  rolesPermitidos={[
                    "auxiliar_farmacia",
                    "regente_farmacia",
                  ]}
                />
              }
            >
              <Route
                path="dispensacion"
                element={<Dispensacion />}
              />
              <Route
                path="traslados"
                element={<Traslados />}
              />
            </Route>

            {/* Auxiliar, regente y auditor */}
            <Route
              element={
                <ProtectedRoute
                  rolesPermitidos={[
                    "auxiliar_farmacia",
                    "regente_farmacia",
                    "auditor",
                  ]}
                />
              }
            >
              <Route
                path="inventario"
                element={<Inventario />}
              />
              <Route
                path="kardex"
                element={<Kardex />}
              />
            </Route>
          </Route>
        </Route>

        {/* Rutas desconocidas */}
        <Route
          path="*"
          element={<Navigate to="/acceso-denegado" replace />}
        />
      </Routes>
    </AuthProvider>
  );
}