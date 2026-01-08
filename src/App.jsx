import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Pedidos from "./pages/Pedidos";
import Usuarios from "./pages/Usuarios";
import Reportes from "./pages/Reportes"; 
import Deudas from "./pages/Deudas";




export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />
        
        {/* Rutas Privadas (Sistema) */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Al entrar a /admin, redirigir a resumen */}
          <Route index element={<Navigate to="/admin/resumen" replace />} />
          
          <Route path="resumen" element={<Dashboard />} />
          <Route path="menu" element={<Menu />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="deudas" element={<Deudas />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}