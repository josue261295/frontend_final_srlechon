import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  // Función para saber si el enlace está activo
  const isActive = (path) => location.pathname === path 
    ? "bg-orange-50 text-orange-700" 
    : "text-gray-600 hover:bg-gray-50";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR FIJO */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center justify-center border-b border-gray-100">
           <span className="text-2xl">🐷</span>
           <span className="ml-2 text-xl font-bold text-orange-600">Sr. Lechón</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          
          <Link to="/admin/resumen" className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/admin/resumen')}`}>
            📊 Resumen
          </Link>

          <Link to="/admin/menu" className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/admin/menu')}`}>
            🍽️ Gestión de Menú
          </Link>
          
          <Link to="/admin/pedidos" className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/admin/pedidos')}`}>
            📝 Pedidos
          </Link>

          

<Link to="/admin/usuarios" className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/admin/usuarios')}`}>
   👥 Personal 
</Link>

          {/* Más botones basados en tu ERD */}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO DINÁMICO */}
      <main className="flex-1 overflow-y-auto">
        {/* Aquí se cargan las páginas hijas */}
        <Outlet />
      </main>
    </div>
  );
}