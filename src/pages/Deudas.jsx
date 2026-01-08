import { useState, useMemo } from 'react';

export default function Deudas() {
  // --- ESTADOS DE DATOS ---
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [itemsSeleccionados, setItemsSeleccionados] = useState([]); 
  
  // --- ESTADOS DEL MODAL DE COBRO ---
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState("EFECTIVO");
  const [montoRecibido, setMontoRecibido] = useState("");

  // --- DATOS SIMULADOS ---
  const [deudasDetalladas, setDeudasDetalladas] = useState([
    { id: 101, clienteId: 1, cliente: "Juan Pérez (Vecino)", fecha: "02/01/2026", plato: "1x Lechón al Horno", precio: 45.00 },
    { id: 102, clienteId: 1, cliente: "Juan Pérez (Vecino)", fecha: "03/01/2026", plato: "2x Coca Cola 2L", precio: 30.00 },
    { id: 103, clienteId: 1, cliente: "Juan Pérez (Vecino)", fecha: "04/01/2026", plato: "1x Fricasé", precio: 35.00 },
    { id: 201, clienteId: 2, cliente: "Lic. Carlos (Alcaldía)", fecha: "04/01/2026", plato: "3x Almuerzos Ejecutivos", precio: 45.00 },
    { id: 301, clienteId: 3, cliente: "Dra. Ana", fecha: "01/01/2026", plato: "1x Chicharrón", precio: 50.00 },
    { id: 302, clienteId: 3, cliente: "Dra. Ana", fecha: "03/01/2026", plato: "1x Jarra Mocochinchi", precio: 15.00 },
  ]);

  // --- LÓGICA DE CÁLCULOS ---
  
  // 1. Agrupar clientes
  const clientesConDeuda = useMemo(() => {
    const mapa = {};
    deudasDetalladas.forEach(item => {
      if (!mapa[item.clienteId]) {
        mapa[item.clienteId] = { 
          id: item.clienteId, 
          nombre: item.cliente, 
          totalDeuda: 0, 
          cantidadItems: 0 
        };
      }
      mapa[item.clienteId].totalDeuda += item.precio;
      mapa[item.clienteId].cantidadItems += 1;
    });
    return Object.values(mapa);
  }, [deudasDetalladas]);

  // 2. Items del cliente actual
  const itemsDelCliente = clienteSeleccionado 
    ? deudasDetalladas.filter(d => d.clienteId === clienteSeleccionado.id)
    : [];

  // 3. Toggle checkbox
  const toggleItem = (id) => {
    if (itemsSeleccionados.includes(id)) {
      setItemsSeleccionados(itemsSeleccionados.filter(itemId => itemId !== id));
    } else {
      setItemsSeleccionados([...itemsSeleccionados, id]);
    }
  };

  // 4. Calcular total seleccionado
  const totalA_Pagar = itemsDelCliente
    .filter(item => itemsSeleccionados.includes(item.id))
    .reduce((acc, curr) => acc + curr.precio, 0);

  // 5. Calcular cambio
  const calcularCambio = () => {
    const recibido = parseFloat(montoRecibido);
    if (!recibido || recibido < totalA_Pagar) return 0;
    return recibido - totalA_Pagar;
  };

  // --- LÓGICA DE COBRO ---
  
  const abrirModalPago = () => {
    setMetodoPago("EFECTIVO");
    setMontoRecibido("");
    setMostrarModalPago(true);
  };

  const confirmarCobroFinal = () => {
    // Validación de efectivo
    if (metodoPago === "EFECTIVO") {
      if (!montoRecibido || parseFloat(montoRecibido) < totalA_Pagar) {
        alert("El monto recibido es insuficiente.");
        return;
      }
    }

    // Procesar: Borrar deudas pagadas
    const nuevasDeudas = deudasDetalladas.filter(d => !itemsSeleccionados.includes(d.id));
    setDeudasDetalladas(nuevasDeudas);
    
    // Cerrar todo y limpiar
    setMostrarModalPago(false);
    setItemsSeleccionados([]);
    
    // Verificar si el cliente quedó sin deuda
    const quedanItems = nuevasDeudas.some(d => d.clienteId === clienteSeleccionado.id);
    if (!quedanItems) {
      setClienteSeleccionado(null);
      alert("¡Deuda totalmente saldada!");
    } else {
      alert("Pago parcial registrado con éxito.");
    }
  };

  return (
    <div className="p-8 h-[calc(100vh-80px)] flex flex-col relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Cobranza (Fiados)</h1>
        <p className="text-gray-500">Selecciona un cliente y marca los consumos que va a pagar hoy.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        
        {/* COLUMNA IZQUIERDA: LISTA DE CLIENTES */}
        <div className="lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto">
          <div className="p-4 bg-gray-50 border-b border-gray-100 sticky top-0">
            <h2 className="font-bold text-gray-700 uppercase text-xs">Clientes Deudores</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {clientesConDeuda.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No hay deudas pendientes 🎉</div>
            ) : (
              clientesConDeuda.map((cliente) => (
                <button
                  key={cliente.id}
                  onClick={() => {
                    setClienteSeleccionado(cliente);
                    setItemsSeleccionados([]);
                  }}
                  className={`w-full text-left p-4 hover:bg-orange-50 transition flex justify-between items-center ${
                    clienteSeleccionado?.id === cliente.id ? 'bg-orange-100 border-l-4 border-orange-500' : ''
                  }`}
                >
                  <div>
                    <div className="font-bold text-gray-800">{cliente.nombre}</div>
                    <div className="text-xs text-gray-500">{cliente.cantidadItems} consumos pendientes</div>
                  </div>
                  <div className="font-bold text-red-600">Bs. {cliente.totalDeuda.toFixed(2)}</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: DETALLE */}
        <div className="lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          {clienteSeleccionado ? (
            <>
              {/* Info Cliente */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{clienteSeleccionado.nombre}</h2>
                  <p className="text-sm text-gray-500">Selecciona los ítems a cobrar</p>
                </div>
                <div className="text-right">
                   <div className="text-xs text-gray-500 font-bold uppercase">Deuda Total</div>
                   <div className="text-2xl font-bold text-gray-800">Bs. {clienteSeleccionado.totalDeuda.toFixed(2)}</div>
                </div>
              </div>

              {/* Lista Items */}
              <div className="flex-1 overflow-y-auto p-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs text-gray-400 font-bold uppercase border-b border-gray-100">
                      <th className="pb-2 w-10 text-center">✔</th>
                      <th className="pb-2">Fecha</th>
                      <th className="pb-2">Detalle del Consumo</th>
                      <th className="pb-2 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {itemsDelCliente.map((item) => (
                      <tr key={item.id} className={`hover:bg-gray-50 transition ${itemsSeleccionados.includes(item.id) ? 'bg-blue-50' : ''}`}>
                        <td className="py-3 text-center">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 cursor-pointer"
                            checked={itemsSeleccionados.includes(item.id)}
                            onChange={() => toggleItem(item.id)}
                          />
                        </td>
                        <td className="py-3 text-sm text-gray-600">{item.fecha}</td>
                        <td className="py-3 font-medium text-gray-800">{item.plato}</td>
                        <td className="py-3 text-right font-bold text-gray-700">Bs. {item.precio.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Botón Abrir Modal */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium">Seleccionados: {itemsSeleccionados.length}</span>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="block text-xs font-bold text-gray-500 uppercase">A Cobrar Ahora</span>
                      <span className="block text-3xl font-bold text-green-600">Bs. {totalA_Pagar.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={abrirModalPago}
                      disabled={totalA_Pagar === 0}
                      className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg transition transform ${
                        totalA_Pagar > 0 
                          ? 'bg-green-600 hover:bg-green-700 hover:scale-105' 
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      💲 Cobrar
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
              <span className="text-6xl mb-4">👈</span>
              <p className="text-xl font-medium">Selecciona un cliente de la lista</p>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL DE COBRO (SIN FIADO) --- */}
      {mostrarModalPago && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="bg-gray-900 p-6 text-white text-center">
              <h2 className="text-2xl font-bold">Cobrar Deuda</h2>
              <p className="opacity-80 mt-1">{clienteSeleccionado.nombre}</p>
            </div>
            
            <div className="p-8">
              <div className="text-center mb-6">
                <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total a Pagar</span>
                <div className="text-5xl font-extrabold text-gray-900 mt-2">
                  Bs. {totalA_Pagar.toFixed(2)}
                </div>
              </div>

              {/* Selector de Métodos (SOLO 3 OPCIONES: Efectivo, QR, Consume) */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button 
                  onClick={() => setMetodoPago("EFECTIVO")}
                  className={`p-2 rounded-xl font-bold border-2 transition-all flex flex-col items-center ${metodoPago === "EFECTIVO" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                >
                  <span className="text-2xl">💵</span>
                  <span className="text-xs mt-1">Efectivo</span>
                </button>
                <button 
                  onClick={() => setMetodoPago("QR")}
                  className={`p-2 rounded-xl font-bold border-2 transition-all flex flex-col items-center ${metodoPago === "QR" ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                >
                  <span className="text-2xl">📱</span>
                  <span className="text-xs mt-1">QR</span>
                </button>
                <button 
                  onClick={() => setMetodoPago("CONSUME")}
                  className={`p-2 rounded-xl font-bold border-2 transition-all flex flex-col items-center ${metodoPago === "CONSUME" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                >
                  <span className="text-2xl">🇧🇴</span>
                  <span className="text-xs mt-1 text-center leading-tight">Consume<br/>lo Nuestro</span>
                </button>
              </div>

              {/* Input Dinámico */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                {metodoPago === "EFECTIVO" && (
                  <>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Monto Recibido</label>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl text-gray-400">Bs.</span>
                      <input 
                        type="number" 
                        autoFocus
                        className="w-full bg-transparent text-3xl font-bold text-gray-800 outline-none placeholder-gray-300"
                        placeholder="0.00"
                        value={montoRecibido}
                        onChange={(e) => setMontoRecibido(e.target.value)}
                      />
                    </div>
                    {parseFloat(montoRecibido) >= totalA_Pagar && (
                      <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-green-700">
                        <span className="font-bold">Cambio a Dar:</span>
                        <span className="text-xl font-bold">Bs. {calcularCambio().toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}
                {metodoPago === "QR" && <p className="text-center text-purple-600 font-medium">Verifica la transferencia QR por el monto exacto.</p>}
                {metodoPago === "CONSUME" && <p className="text-center text-red-600 font-medium">Procesa el cobro por billetera móvil (Sin cambio).</p>}
              </div>

              {/* Botones Finales */}
              <div className="flex gap-3">
                <button 
                  onClick={() => setMostrarModalPago(false)}
                  className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmarCobroFinal}
                  className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black shadow-lg transition transform active:scale-95"
                >
                  Confirmar Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}