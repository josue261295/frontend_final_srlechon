import { useState } from 'react';

export default function Usuarios() {
  // --- 1. ESTADOS ---
  const [mostrarModal, setMostrarModal] = useState(false);
  
  // Datos del formulario
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    email: '',
    rol: 'EMPLEADO', // Valor por defecto
    telefono: ''
  });

  // Datos simulados (Mock Data)
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "Josué Paco", email: "admin@srlechon.com", rol: "ADMIN", estado: "ACTIVO", telefono: "63097329" },
    { id: 2, nombre: "María Cajera", email: "caja@srlechon.com", rol: "EMPLEADO", estado: "ACTIVO", telefono: "77712345" },
    { id: 3, nombre: "Juan Cocinero", email: "cocina@srlechon.com", rol: "EMPLEADO", estado: "INACTIVO", telefono: "60054321" },
  ]);

  // --- 2. FUNCIONES ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario({ ...nuevoUsuario, [name]: value });
  };

  const guardarUsuario = (e) => {
    e.preventDefault(); 
    
    // Crear el objeto usuario
    const usuarioGuardar = {
      id: usuarios.length + 1,
      ...nuevoUsuario,
      estado: "ACTIVO"
    };

    setUsuarios([...usuarios, usuarioGuardar]);
    cerrarModal();
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setNuevoUsuario({ nombre: '', email: '', rol: 'EMPLEADO', telefono: '' });
  };

  const eliminarUsuario = (id) => {
    if(confirm("¿Seguro que quieres eliminar a este usuario?")) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Equipo de Trabajo</h1>
          <p className="text-gray-500">Gestiona el acceso al sistema</p>
        </div>
        <button 
          onClick={() => setMostrarModal(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-900 transition flex items-center gap-2"
        >
          <span>+</span> Registrar Personal
        </button>
      </div>

      {/* --- TABLA DE USUARIOS --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
            <tr>
              <th className="py-4 px-6">Nombre</th>
              <th className="py-4 px-6">Contacto</th>
              <th className="py-4 px-6">Rol</th>
              <th className="py-4 px-6">Estado</th>
              <th className="py-4 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50 transition">
                <td className="py-4 px-6">
                  <div className="font-bold text-gray-800">{usuario.nombre}</div>
                  <div className="text-xs text-gray-500">ID: {usuario.id}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm">{usuario.email}</div>
                  <div className="text-xs text-gray-500">Tel: {usuario.telefono}</div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    usuario.rol === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {usuario.rol}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    usuario.estado === 'ACTIVO' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${usuario.estado === 'ACTIVO' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {usuario.estado}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button 
                    onClick={() => eliminarUsuario(usuario.id)}
                    className="text-gray-400 hover:text-red-600 transition"
                    title="Eliminar usuario"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL DE REGISTRO --- */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Nuevo Empleado</h2>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-red-500">✕</button>
            </div>

            <form onSubmit={guardarUsuario} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  name="nombre"
                  required
                  placeholder="Ej. Juan Pérez"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                  value={nuevoUsuario.nombre}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                   <input 
                    type="text" 
                    name="telefono"
                    placeholder="Ej. 777..."
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                    value={nuevoUsuario.telefono}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                   <select 
                    name="rol"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                    value={nuevoUsuario.rol}
                    onChange={handleInputChange}
                   >
                     <option value="EMPLEADO">Empleado</option>
                     <option value="ADMIN">Administrador</option>
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico (Usuario)</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="empleado@srlechon.com"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                  value={nuevoUsuario.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Temporal</label>
                <input 
                  type="password" 
                  disabled
                  placeholder="123456"
                  className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">* Por defecto será '123456'</p>
              </div>

              <button 
                type="submit"
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition mt-4"
              >
                Guardar Registro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}