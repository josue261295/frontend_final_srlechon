import { useState, useEffect } from 'react';

export default function Reportes() {
  const [rango, setRango] = useState('HOY');
  const [esAdmin, setEsAdmin] = useState(false);
  const [metodoFiltro, setMetodoFiltro] = useState('TODOS'); // Estado para las pestañas

  // Detectar rol al cargar
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('USER_DATA') || '{}');
    if (data.rol === 'ADMIN') {
      setEsAdmin(true);
    } else {
      setRango('HOY');
    }
  }, []);

  // DATOS SIMULADOS (Ahora incluyen "detalle" de qué comieron)
  const movimientos = [
    { id: 1, fecha: "04/01 12:15", cliente: "Juan Pérez", detalle: "2x Lechón, 1x Coca Cola", total: 105.00, metodo: "EFECTIVO", cajero: "Maria" },
    { id: 2, fecha: "04/01 12:30", cliente: "Mesa 4 (Familia)", detalle: "1x Fricasé, 3x Chicharrón", total: 185.00, metodo: "QR", cajero: "Maria" },
    { id: 3, fecha: "04/01 13:00", cliente: "Lic. Carlos (Alcaldía)", detalle: "1x Almuerzo Ejecutivo", total: 15.00, metodo: "CONSUME", cajero: "Josué" },
    { id: 4, fecha: "04/01 13:10", cliente: "Dra. Ana (Vecina)", detalle: "1x Pollo al horno, 1x Jugo", total: 25.00, metodo: "DEUDA", cajero: "Maria" },
    { id: 5, fecha: "04/01 13:45", cliente: "Pedro Alanes", detalle: "1x Lechón (Llevar)", total: 45.00, metodo: "EFECTIVO", cajero: "Josué" },
    { id: 6, fecha: "04/01 14:00", cliente: "Ing. Roberto", detalle: "5x Platos Extra Lechón", total: 225.00, metodo: "QR", cajero: "Josué" },
  ];

  // Filtramos la lista según la pestaña seleccionada
  const movimientosFiltrados = metodoFiltro === 'TODOS' 
    ? movimientos 
    : movimientos.filter(m => m.metodo === metodoFiltro);

  // Función para calcular totales
  const calcularTotal = (metodo) => {
    return movimientos
      .filter(m => metodo === 'TODOS' || m.metodo === metodo)
      .reduce((acc, curr) => acc + curr.total, 0);
  };

  return (
    <div className="p-8">
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {esAdmin ? 'Reporte General de Ventas' : 'Cierre de Caja Diario'}
          </h1>
          <p className="text-gray-500">
            {esAdmin ? 'Detalle completo de transacciones' : `Movimientos del día: ${new Date().toLocaleDateString()}`}
          </p>
        </div>
        
        {/* Selector de Fecha (Solo Admin) */}
        {esAdmin && (
          <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex">
            {['HOY', 'SEMANA', 'MES'].map((periodo) => (
              <button
                key={periodo}
                onClick={() => setRango(periodo)}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                  rango === periodo ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {periodo}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TARJETAS DE TOTALES (Resumen Rápido) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <div className="text-green-800 text-xs font-bold uppercase">💵 Efectivo</div>
          <div className="text-2xl font-bold text-green-700 mt-1">Bs. {calcularTotal('EFECTIVO')}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
          <div className="text-purple-800 text-xs font-bold uppercase">📱 QR / Banco</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">Bs. {calcularTotal('QR')}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <div className="text-red-800 text-xs font-bold uppercase">🇧🇴 Consume lo Nuestro</div>
          <div className="text-2xl font-bold text-red-700 mt-1">Bs. {calcularTotal('CONSUME')}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
          <div className="text-orange-800 text-xs font-bold uppercase">📒 A Cuenta (Deuda)</div>
          <div className="text-2xl font-bold text-orange-700 mt-1">Bs. {calcularTotal('DEUDA')}</div>
        </div>
      </div>

      {/* PESTAÑAS DE NAVEGACIÓN (TABS) */}
      <div className="flex overflow-x-auto gap-2 mb-4 border-b border-gray-200 pb-1">
        {[
          { id: 'TODOS', label: 'Todo', icon: '📋' },
          { id: 'EFECTIVO', label: 'Efectivo', icon: '💵' },
          { id: 'QR', label: 'QR Simple', icon: '📱' },
          { id: 'CONSUME', label: 'Consume lo Nuestro', icon: '🇧🇴' },
          { id: 'DEUDA', label: 'A Cuenta', icon: '📒' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMetodoFiltro(tab.id)}
            className={`px-4 py-2 rounded-t-lg font-bold text-sm flex items-center gap-2 transition-colors ${
              metodoFiltro === tab.id 
                ? 'bg-white border-x border-t border-gray-200 text-orange-600 relative top-[1px]' 
                : 'bg-transparent text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABLA DETALLADA */}
      <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-xs text-gray-500 font-bold uppercase">
            <tr>
              <th className="p-4 border-b border-gray-100">Fecha y Hora</th>
              <th className="p-4 border-b border-gray-100">Cliente</th>
              <th className="p-4 border-b border-gray-100 w-1/3">Detalle de Consumo</th>
              <th className="p-4 border-b border-gray-100">Método</th>
              <th className="p-4 border-b border-gray-100 text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {movimientosFiltrados.length > 0 ? movimientosFiltrados.map((venta) => (
              <tr key={venta.id} className="hover:bg-gray-50 transition">
                <td className="p-4 text-sm text-gray-600 font-mono">
                  {venta.fecha}
                </td>
                <td className="p-4">
                  <div className="font-bold text-gray-800">{venta.cliente}</div>
                  <div className="text-xs text-gray-400">Atendió: {venta.cajero}</div>
                </td>
                <td className="p-4">
                  <p className="text-sm text-gray-700 italic bg-gray-50 p-2 rounded border border-gray-100 inline-block">
                    {venta.detalle}
                  </p>
                </td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    venta.metodo === 'EFECTIVO' ? 'bg-green-100 text-green-700 border-green-200' :
                    venta.metodo === 'QR' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                    venta.metodo === 'CONSUME' ? 'bg-red-100 text-red-700 border-red-200' :
                    'bg-orange-100 text-orange-700 border-orange-200'
                  }`}>
                    {venta.metodo === 'CONSUME' ? 'CONSUME LO NUESTRO' : venta.metodo}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className="font-bold text-gray-800 text-lg">Bs. {venta.total.toFixed(2)}</span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  No hay movimientos registrados en esta categoría.
                </td>
              </tr>
            )}
          </tbody>
          {/* PIE DE TABLA CON TOTAL DE LA SELECCIÓN */}
          <tfoot className="bg-gray-50 border-t border-gray-200">
            <tr>
              <td colSpan="4" className="p-4 text-right font-bold text-gray-600">TOTAL SELECCIONADO:</td>
              <td className="p-4 text-right font-extrabold text-xl text-orange-600">
                Bs. {movimientosFiltrados.reduce((acc, curr) => acc + curr.total, 0).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}