
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Dispensacion from "./pages/Dispensacion";
import Traslados from "./pages/Traslados";
import Inventario from "./pages/Inventario";
import Kardex from "./pages/Kardex";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<DashboardLayout />}>
                <Route
                    index
                    element={<Navigate to="/inventario" replace />}
                />
                <Route path="/dispensacion" element={<Dispensacion />} />
                <Route path="/traslados" element={<Traslados />} />
                <Route path="/inventario" element={<Inventario />} />
                <Route path="/kardex" element={<Kardex />} />
            </Route>

            <Route
                path="*"
                element={<Navigate to="/inventario" replace />}
            />
        </Routes>
    );
}

export default App;
