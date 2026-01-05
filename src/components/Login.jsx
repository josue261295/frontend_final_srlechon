import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- Importamos esto

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // <--- Activamos la navegación

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // AQUÍ VALIDARÍAMOS CON TU BASE DE DATOS (USUARIO)
    // Por ahora, simulamos que el login es correcto:
    console.log("Logueado con:", email);
    
    // Redirigir al Dashboard
    navigate('/admin/resumen'); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-orange-100">
        
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl">
            🐷
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Sr. Lechón
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Ingresa al sistema administrativo
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                placeholder="admin@srlechon.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Ingresar al Sistema
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-gray-400 mt-4">
          © 2026 Sr. Lechón - Sistema de Gestión
        </div>
      </div>
    </div>
  );
}