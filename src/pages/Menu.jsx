export default function Menu() {
  // Datos simulados basados en tu tabla PLATO
  const platos = [
    { id: 1, nombre: "Lechón al Horno", descripcion: "Plato tradicional con papas y ensalada", activo: true },
    { id: 2, nombre: "Chicharrón", descripcion: "Cerdo frito con mote y llajua", activo: true },
    { id: 3, nombre: "Fricasé", descripcion: "Caldo picante de cerdo", activo: false },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Menú (Platos)</h1>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">
          + Nuevo Plato
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-4 px-6 font-medium text-gray-600">Nombre</th>
              <th className="py-4 px-6 font-medium text-gray-600">Descripción</th>
              <th className="py-4 px-6 font-medium text-gray-600">Estado</th>
              <th className="py-4 px-6 font-medium text-gray-600 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {platos.map((plato) => (
              <tr key={plato.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium text-gray-800">{plato.nombre}</td>
                <td className="py-4 px-6 text-gray-500">{plato.descripcion}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    plato.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {plato.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Editar</button>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}