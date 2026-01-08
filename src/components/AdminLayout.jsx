import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [rolUsuario, setRolUsuario] = useState(""); 
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    // 1. Leemos los datos guardados en el Login
    const dataGuardada = localStorage.getItem('USER_DATA');
    
    if (dataGuardada) {
      const usuario = JSON.parse(dataGuardada);
      
      // --- DEBUG: MIRA ESTO EN LA CONSOLA DEL NAVEGADOR (F12) ---
      console.log("🔍 DATOS USUARIO:", usuario);
      
      // Guardamos el nombre para mostrarlo abajo
      // Intentamos varias formas por si tu backend usa 'names' o 'nombre'
      setNombreUsuario(usuario.names || usuario.nombre || "Usuario");
      
      // 2. LÓGICA DE DETECCIÓN DE ROL (CORREGIDA)
      // Buscamos el ID del rol o el nombre
      const idRol = usuario.idRol || usuario.roleId || 0;
      const nombreRol = usuario.rol || usuario.role || usuario.nombreRol || "";

      setRolUsuario(nombreRol);

      // Aquí está la corrección basada en tus imágenes:
      // Si el idRol es 1 (según tu Postman) O si se llama "administrador" (según tu BD)
      if (idRol === 1 || nombreRol.toLowerCase() === 'administrador' || nombreRol === 'ADMIN') {
        console.log("✅ ES ADMIN (Detectado por ID o Nombre)");
        setEsAdmin(true);
      } else {
        console.log("⛔ NO ES ADMIN (Se mostrará vista Cajero)");
        setEsAdmin(false);
      }

    } else {
      // Si no hay sesión, podrías redirigir al login
      // navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('AUTH_TOKEN');
    localStorage.removeItem('USER_DATA');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path 
    ? "bg-orange-50 text-orange-700 shadow-sm ring-1 ring-orange-200" 
    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-lg z-10">
        <div className="p-6 flex items-center justify-center border-b border-gray-100 bg-orange-50">
           <span className="text-3xl filter drop-shadow-md">🐷</span>
           <div className="ml-3">
             <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">Sr. Lechón</h1>
             <span className={`text-xs font-bold px-2 py-0.5 rounded-full border uppercase ${
               esAdmin ? 'text-purple-600 bg-purple-100 border-purple-200' : 'text-orange-600 bg-orange-100 border-orange-200'
             }`}>
               {esAdmin ? 'Administrador' : 'Caja / Servicio'}
             </span>
           </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          
          <div className="px-3 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            Operaciones
          </div>

          {/* ESTOS LOS VEN TODOS */}
          <Link to="/admin/pedidos" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${isActive('/admin/pedidos')}`}>
            <span className="text-xl">📝</span> Caja y Pedidos
          </Link>

          <Link to="/admin/deudas" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${isActive('/admin/deudas')}`}>
            <span className="text-xl">📒</span> Cobrar Deudas
          </Link>

          <Link to="/admin/menu" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${isActive('/admin/menu')}`}>
            <span className="text-xl">🍽️</span> Menú del Día
          </Link>

          <Link to="/admin/reservas" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${isActive('/admin/reservas')}`}>
            <span className="text-xl">📅</span> Reservas
          </Link>

          <Link to="/admin/reportes" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${isActive('/admin/reportes')}`}>
            <span className="text-xl">📈</span> Cierre Diario
          </Link>

          {/* --- ZONA EXCLUSIVA ADMIN (SE MUESTRA SI esAdmin ES TRUE) --- */}
          {esAdmin && (
            <>
              <div className="px-3 mt-6 mb-2 text-xs font-bold text-purple-600 uppercase tracking-wider border-t border-gray-100 pt-4">
                Zona Admin
              </div>

              <Link to="/admin/resumen" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${isActive('/admin/resumen')}`}>
                <span className="text-xl">📊</span> Dashboard Global
              </Link>
              
              <Link to="/admin/usuarios" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${isActive('/admin/usuarios')}`}>
                <span className="text-xl">👥</span> Personal
              </Link>

              <Link to="/admin/consultas" className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${isActive('/admin/consultas')}`}>
                <span className="text-xl">🤖</span> Chatbot IA
              </Link>
            </>
          )}

        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center mb-3">
             <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold text-xs uppercase">
               {(nombreUsuario && nombreUsuario.length > 0) ? nombreUsuario.charAt(0) : "U"}
             </div>
             <div className="ml-3 overflow-hidden">
               <p className="text-sm font-bold text-gray-900 truncate">{nombreUsuario}</p>
             </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-white border border-red-100 hover:bg-red-50 rounded-lg transition-colors shadow-sm">
            <span>🚪</span> Salir
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}