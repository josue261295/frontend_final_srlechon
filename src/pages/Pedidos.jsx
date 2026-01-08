import { useState } from 'react';

export default function Pedidos() {
  // --- ESTADOS ---
  const [mostrarModalPedido, setMostrarModalPedido] = useState(false);
  const [pedidoACobrar, setPedidoACobrar] = useState(null); 
  
  // Carrito y Nuevo Pedido
  const [carrito, setCarrito] = useState([]);
  const [nombreCliente, setNombreCliente] = useState("");
  const [tipoPedido, setTipoPedido] = useState("LOCAL");

  // Datos de Pago
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState("EFECTIVO");
  const [montoRecibido, setMontoRecibido] = useState("");

  // --- DATOS SIMULADOS DEL MENÚ (Lo que configuraste en la otra pantalla) ---
  // En el futuro, esto vendrá de la Base de Datos
  const menuDia = {
    precioAlmuerzo: 15.00,
    sopa: "Sopa de Maní",
    segundos: [
      { id: 's1', nombre: "Sajta de Pollo", stock: 20, stockInicial: 20 },
      { id: 's2', nombre: "Falso Conejo", stock: 5, stockInicial: 30 }, // Quedan pocos
      { id: 's3', nombre: "Milanesa", stock: 0, stockInicial: 15 }      // Agotado
    ]
  };

 const extrasBebidas = [
    { id: 'e1', nombre: "Plato Extra Lechón", precio: 50.00, tipo: "EXTRA" },
    { id: 'e2', nombre: "Trucha Frita", precio: 40.00, tipo: "EXTRA" },
    { id: 'b1', nombre: "Coca Cola 2L", precio: 16.00, tipo: "BEBIDA" },
    { id: 'b2', nombre: "Coca Cola Personal", precio: 5.00, tipo: "BEBIDA" },
  ];

  // Estado local para manejar el stock visual mientras pedimos
  const [stockDinamico, setStockDinamico] = useState(menuDia.segundos);

  const [pedidos, setPedidos] = useState([
    { id: 101, cliente: "Juan Pérez", tipo: "LOCAL", total: 45.00, estado: "PENDIENTE", hora: "12:30" },
    { id: 102, cliente: "Reserva: María", tipo: "LLEVAR", total: 120.50, estado: "LISTO", hora: "12:35" },
  ]);

  // --- LÓGICA DEL CARRITO ---
  
  // Agregar ALMUERZO (Sopa + Segundo)
  const agregarAlmuerzo = (segundoId) => {
    const segundo = stockDinamico.find(s => s.id === segundoId);
    
    if (segundo.stock > 0) {
      // Restamos stock visualmente
      setStockDinamico(prev => prev.map(s => s.id === segundoId ? { ...s, stock: s.stock - 1 } : s));

      // Agregamos al carrito
      const itemCarritoId = `almuerzo-${segundoId}`;
      setCarrito(prev => {
        const existe = prev.find(item => item.id === itemCarritoId);
        if (existe) {
          return prev.map(item => item.id === itemCarritoId ? { ...item, cantidad: item.cantidad + 1 } : item);
        }
        return [...prev, { 
          id: itemCarritoId, 
          nombre: `Almuerzo (${segundo.nombre})`, 
          precio: menuDia.precioAlmuerzo, 
          cantidad: 1,
          esAlmuerzo: true, // Para saber que devuelve stock al borrar
          segundoOriginalId: segundoId
        }];
      });
    }
  };

  // Agregar EXTRA o BEBIDA
  const agregarExtra = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) return prev.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const restarDelCarrito = (itemCarrito) => {
    // Si es almuerzo, devolvemos el stock
    if (itemCarrito.esAlmuerzo) {
      setStockDinamico(prev => prev.map(s => s.id === itemCarrito.segundoOriginalId ? { ...s, stock: s.stock + 1 } : s));
    }

    setCarrito(prev => prev.map(item => item.id === itemCarrito.id ? { ...item, cantidad: item.cantidad - 1 } : item).filter(item => item.cantidad > 0));
  };

  const eliminarItem = (itemCarrito) => {
    // Si borramos todo, devolvemos todo el stock
    if (itemCarrito.esAlmuerzo) {
      setStockDinamico(prev => prev.map(s => s.id === itemCarrito.segundoOriginalId ? { ...s, stock: s.stock + itemCarrito.cantidad } : s));
    }
    setCarrito(prev => prev.filter(item => item.id !== itemCarrito.id));
  };

  const calcularTotalCarrito = () => carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

  const guardarPedido = () => {
    if (carrito.length === 0 || nombreCliente.trim() === "") return alert("Falta datos");
    
    // Aquí actualizamos el "Stock Real" en la base de datos (simulado)
    // menuDia.segundos = stockDinamico; 

    const nuevo = {
      id: pedidos.length + 101 + Math.floor(Math.random() * 100),
      cliente: nombreCliente,
      tipo: tipoPedido,
      total: calcularTotalCarrito(),
      estado: "PENDIENTE",
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setPedidos([nuevo, ...pedidos]);
    cerrarModalPedido();
  };

  const cerrarModalPedido = () => {
    setMostrarModalPedido(false);
    setCarrito([]);
    setNombreCliente("");
    setTipoPedido("LOCAL");
    // Reiniciamos el stock dinámico al valor original si cancela? 
    // En realidad, deberíamos recargar desde la BD. Por ahora lo dejamos como quedó.
  };

  // --- COBRO ---
  const abrirCobro = (pedido) => {
    setPedidoACobrar(pedido);
    setMetodoPago("EFECTIVO");
    setMontoRecibido("");
    setMostrarModalPago(true);
  };

  const procesarPago = () => {
    if (metodoPago === "EFECTIVO" && (!montoRecibido || parseFloat(montoRecibido) < pedidoACobrar.total)) {
      alert("Monto insuficiente"); return;
    }
    setPedidos(pedidos.map(p => p.id === pedidoACobrar.id ? { ...p, estado: "COMPLETADO" } : p));
    setPedidoACobrar(null);
    setMostrarModalPago(false);
    alert("Venta registrada.");
  };

  const calcularCambio = () => {
    const recibido = parseFloat(montoRecibido);
    if (!recibido || recibido < pedidoACobrar.total) return 0;
    return recibido - pedidoACobrar.total;
  };

  // Helper de colores
  const getStatusColor = (estado) => {
    switch (estado) {
      case "PENDIENTE": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LISTO": return "bg-orange-100 text-orange-800 border-orange-200";
      case "COMPLETADO": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Caja y Pedidos</h1>
        <button 
          onClick={() => {
             // Al abrir, reiniciamos el stock visual con los datos actuales
             setStockDinamico(menuDia.segundos);
             setMostrarModalPedido(true);
          }}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700 transition shadow-lg flex items-center gap-2"
        >
          <span>+</span> Nuevo Pedido
        </button>
      </div>

      {/* GRID DE PEDIDOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-full hover:shadow-md transition">
            <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold rounded-bl-xl ${
              pedido.tipo === 'LOCAL' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
            }`}>
              {pedido.tipo === 'LOCAL' ? 'EN LOCAL' : 'PARA LLEVAR'}
            </div>
            
            <div>
              <div className="pr-12 mb-3">
                <span className="text-xs font-bold text-gray-400">#{pedido.id}</span>
                <h3 className="font-bold text-xl text-gray-800 truncate">{pedido.cliente}</h3>
                <span className="text-xs text-gray-500">Hora: {pedido.hora}</span>
              </div>
              <div className="mb-4">
                 <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(pedido.estado)}`}>
                  {pedido.estado}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-auto">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500 font-medium">Total:</span>
                <span className="text-2xl font-bold text-gray-900">Bs. {pedido.total.toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {pedido.estado === "PENDIENTE" && (
                   <button onClick={() => setPedidos(pedidos.map(p => p.id === pedido.id ? {...p, estado: "LISTO"} : p))} className="col-span-2 bg-yellow-50 text-yellow-700 py-2 rounded-lg text-xs font-bold border border-yellow-200 hover:bg-yellow-100">👨‍🍳 Simular Cocina</button>
                )}

                {pedido.estado === "LISTO" && (
                  <button onClick={() => abrirCobro(pedido)} className="col-span-2 bg-green-600 text-white py-2 rounded-lg text-sm font-bold shadow-md hover:bg-green-700 animate-pulse">💲 Cobrar y Entregar</button>
                )}
                
                {pedido.estado === "COMPLETADO" && (
                  <button className="col-span-2 bg-gray-100 text-gray-400 cursor-default rounded-lg text-sm py-2">✅ Finalizado</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL 1: TOMA DE PEDIDO (CONFIGURACIÓN MENU DEL DÍA) --- */}
      {mostrarModalPedido && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex overflow-hidden">
            
            {/* IZQUIERDA: MENÚ (Dividido en Almuerzos y Extras) */}
            <div className="w-2/3 bg-gray-50 p-6 overflow-y-auto border-r border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Realizar Pedido</h2>
              
              {/* 1. SECCIÓN ALMUERZO DEL DÍA */}
              <div className="bg-white p-5 rounded-xl border border-orange-200 shadow-sm mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-orange-800 text-lg">🥘 Almuerzo del Día</h3>
                    <p className="text-sm text-gray-500">Incluye: <strong className="text-gray-700">{menuDia.sopa}</strong></p>
                  </div>
                  <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg font-bold text-lg">
                    Bs. {menuDia.precioAlmuerzo}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {stockDinamico.map((segundo) => (
                    <button 
                      key={segundo.id}
                      onClick={() => agregarAlmuerzo(segundo.id)}
                      disabled={segundo.stock <= 0}
                      className={`p-3 rounded-lg border-2 text-left transition-all relative overflow-hidden ${
                        segundo.stock > 0 
                          ? 'bg-white border-orange-100 hover:border-orange-400 hover:shadow-md' 
                          : 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="font-bold text-gray-800">{segundo.nombre}</div>
                      
                      {/* Barra de Stock */}
                      <div className="mt-2 flex justify-between items-center text-xs">
                        <span className={segundo.stock < 5 ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>
                          {segundo.stock > 0 ? `${segundo.stock} disponibles` : 'AGOTADO'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1">
                        <div 
                          className={`h-1.5 rounded-full ${segundo.stock < 5 ? 'bg-red-500' : 'bg-green-500'}`} 
                          style={{ width: `${(segundo.stock / segundo.stockInicial) * 100}%` }}
                        ></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. SECCIÓN EXTRAS Y BEBIDAS */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 text-lg mb-4">🥤 Bebidas y Extras</h3>
                <div className="grid grid-cols-3 gap-3">
                  {extrasBebidas.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => agregarExtra(item)}
                      className="p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition text-left"
                    >
                      <div className="font-bold text-gray-700 text-sm">{item.nombre}</div>
                      <div className="text-blue-600 font-bold mt-1">Bs. {item.precio}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* DERECHA: TICKET / CARRITO */}
            <div className="w-1/3 bg-white p-6 flex flex-col shadow-xl z-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Orden Actual</h2>
                <button onClick={cerrarModalPedido} className="text-gray-400 hover:text-red-500 font-bold text-xl">✕</button>
              </div>

              {/* Datos Cliente */}
              <div className="space-y-3 mb-4 bg-gray-50 p-4 rounded-xl">
                <input type="text" placeholder="Nombre Cliente / Mesa" autoFocus className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-orange-400" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} />
                <div className="flex gap-2">
                    <button onClick={() => setTipoPedido("LOCAL")} className={`flex-1 py-1 rounded text-xs font-bold ${tipoPedido === "LOCAL" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>MESA</button>
                    <button onClick={() => setTipoPedido("LLEVAR")} className={`flex-1 py-1 rounded text-xs font-bold ${tipoPedido === "LLEVAR" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"}`}>LLEVAR</button>
                </div>
              </div>

              {/* Lista Items */}
              <div className="flex-1 overflow-y-auto mb-4 border-t border-gray-100 py-2 space-y-2">
                  {carrito.length === 0 && <p className="text-center text-gray-400 text-sm py-10">El carrito está vacío</p>}
                  {carrito.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 border-b border-gray-50">
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-800">{item.nombre}</div>
                        <div className="text-xs text-gray-500">Bs. {item.precio} c/u</div>
                      </div>
                      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-1">
                        <button onClick={() => restarDelCarrito(item)} className="px-2 text-orange-600 font-bold hover:bg-orange-50 rounded">-</button>
                        <span className="text-sm font-bold w-4 text-center">{item.cantidad}</span>
                        <button onClick={() => item.esAlmuerzo ? agregarAlmuerzo(item.segundoOriginalId) : agregarExtra(item)} className="px-2 text-orange-600 font-bold hover:bg-orange-50 rounded">+</button>
                      </div>
                      <button onClick={() => eliminarItem(item)} className="text-red-400 hover:text-red-600 ml-2">🗑️</button>
                    </div>
                  ))}
              </div>

              {/* Total y Botón */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-xl mb-4">
                  <span className="font-bold text-gray-800">Total:</span>
                  <span className="font-bold text-orange-600">Bs. {calcularTotalCarrito().toFixed(2)}</span>
                </div>
                <button onClick={guardarPedido} className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 shadow-lg active:scale-95 transition">
                  Confirmar Pedido
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL DE PAGO (COBRO) --- */}
      {mostrarModalPago && pedidoACobrar && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
           <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
             <div className="bg-gray-900 p-6 text-white text-center">
               <h2 className="text-2xl font-bold">Cobrar Pedido #{pedidoACobrar.id}</h2>
               <p className="opacity-80 mt-1">{pedidoACobrar.cliente}</p>
             </div>
             
             <div className="p-8">
               <div className="text-center mb-6">
                 <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total a Pagar</span>
                 <div className="text-5xl font-extrabold text-gray-900 mt-2">Bs. {pedidoACobrar.total.toFixed(2)}</div>
               </div>

               {/* 3 MÉTODOS DE PAGO + CRÉDITO PARA GENERAR DEUDA */}
               <div className="grid grid-cols-2 gap-3 mb-6">
                 <button onClick={() => setMetodoPago("EFECTIVO")} className={`p-3 rounded-xl border-2 font-bold ${metodoPago === "EFECTIVO" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500"}`}>💵 Efectivo</button>
                 <button onClick={() => setMetodoPago("QR")} className={`p-3 rounded-xl border-2 font-bold ${metodoPago === "QR" ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 text-gray-500"}`}>📱 QR</button>
                 <button onClick={() => setMetodoPago("CONSUME")} className={`p-3 rounded-xl border-2 font-bold ${metodoPago === "CONSUME" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-500"}`}>🇧🇴 Consume</button>
                 <button onClick={() => setMetodoPago("DEUDA")} className={`p-3 rounded-xl border-2 font-bold ${metodoPago === "DEUDA" ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-500"}`}>📒 A Deuda</button>
               </div>

               {metodoPago === "EFECTIVO" && (
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Monto Recibido</label>
                   <div className="flex items-center gap-2">
                     <span className="text-2xl text-gray-400">Bs.</span>
                     <input type="number" autoFocus className="w-full bg-transparent text-3xl font-bold text-gray-800 outline-none" placeholder="0.00" value={montoRecibido} onChange={(e) => setMontoRecibido(e.target.value)} />
                   </div>
                   {parseFloat(montoRecibido) >= pedidoACobrar.total && (
                     <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between items-center text-green-700 font-bold">
                       <span>Cambio:</span><span>Bs. {calcularCambio().toFixed(2)}</span>
                     </div>
                   )}
                 </div>
               )}

               <div className="flex gap-3">
                 <button onClick={() => setMostrarModalPago(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">Cancelar</button>
                 <button onClick={procesarPago} className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black shadow-lg">Confirmar Cobro</button>
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}