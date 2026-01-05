import { useState } from 'react';

export default function Pedidos() {
  // --- 1. ESTADOS ---
  const [mostrarModal, setMostrarModal] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [nombreCliente, setNombreCliente] = useState("");
  const [tipoPedido, setTipoPedido] = useState("LOCAL");

  // --- 2. DATOS DE EJEMPLO ---
  const menuItems = [
    { id: 1, nombre: "Lechón al Horno", precio: 45.00, emoji: "🍖" },
    { id: 2, nombre: "Chicharrón Especial", precio: 50.00, emoji: "🥓" },
    { id: 3, nombre: "Fricasé Paceño", precio: 35.00, emoji: "🥘" },
    { id: 4, nombre: "Coca Cola 2L", precio: 15.00, emoji: "🥤" },
    { id: 5, nombre: "Jarra de Mocochinchi", precio: 20.00, emoji: "🏺" },
    { id: 6, nombre: "Porción Arroz Extra", precio: 10.00, emoji: "🍚" },
  ];

  const [pedidos, setPedidos] = useState([
    { id: 101, cliente: "Juan Pérez", tipo: "LOCAL", total: 45.00, estado: "PENDIENTE", hora: "12:30" },
    { id: 102, cliente: "Reserva: María", tipo: "LLEVAR", total: 120.50, estado: "LISTO", hora: "12:35" },
  ]);

  // --- 3. FUNCIONES LÓGICAS ---
  
  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item => 
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // NUEVA FUNCIÓN: Restar cantidad
  const restarDelCarrito = (id) => {
    setCarrito(prev => {
      return prev.map(item => {
        if (item.id === id) {
          return { ...item, cantidad: item.cantidad - 1 };
        }
        return item;
      }).filter(item => item.cantidad > 0); // Si llega a 0, se elimina
    });
  };

  // NUEVA FUNCIÓN: Eliminar item completo
  const eliminarItem = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  const calcularTotalCarrito = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const guardarPedido = () => {
    if (carrito.length === 0 || nombreCliente.trim() === "") {
      alert("Falta el nombre del cliente o productos.");
      return;
    }

    const nuevoPedido = {
      id: pedidos.length + 101 + Math.floor(Math.random() * 100),
      cliente: nombreCliente,
      tipo: tipoPedido,
      total: calcularTotalCarrito(),
      estado: "PENDIENTE",
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setPedidos([nuevoPedido, ...pedidos]);
    cerrarModal();
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setCarrito([]);
    setNombreCliente("");
    setTipoPedido("LOCAL");
  };

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
          onClick={() => setMostrarModal(true)}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700 transition shadow-lg flex items-center gap-2"
        >
          <span>+</span> Nuevo Pedido
        </button>
      </div>

      {/* Grid de Pedidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-full">
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
                <button className="bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-100">Ver Ticket</button>
                {pedido.estado === "PENDIENTE" ? (
                   <button className="bg-orange-100 text-orange-700 py-2 rounded-lg text-sm font-bold border border-orange-200 cursor-not-allowed opacity-70">Esperando...</button>
                ) : pedido.estado === "LISTO" ? (
                  <button className="bg-green-600 text-white py-2 rounded-lg text-sm font-bold shadow-md hover:bg-green-700">Cobrar</button>
                ) : (
                  <button className="bg-gray-100 text-gray-400 cursor-default rounded-lg text-sm">Archivar</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL DE NUEVO PEDIDO --- */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex overflow-hidden">
            
            {/* LADO IZQUIERDO: MENÚ */}
            <div className="w-2/3 bg-gray-50 p-6 overflow-y-auto border-r border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Menú Disponible</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => agregarAlCarrito(item)}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all text-left group active:scale-95"
                  >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{item.emoji}</div>
                    <div className="font-bold text-gray-800">{item.nombre}</div>
                    <div className="text-orange-600 font-bold mt-1">Bs. {item.precio}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* LADO DERECHO: TICKET */}
            <div className="w-1/3 bg-white p-6 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Orden Actual</h2>
                <button onClick={cerrarModal} className="text-gray-400 hover:text-red-500 font-bold text-xl">✕</button>
              </div>

              {/* Formulario Cliente */}
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre del Cliente</label>
                  <input 
                    type="text" 
                    autoFocus
                    placeholder="Ej. Juan Pérez"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo Consumo</label>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button 
                      onClick={() => setTipoPedido("LOCAL")}
                      className={`flex-1 py-1 rounded-md text-sm font-bold transition-all ${tipoPedido === "LOCAL" ? "bg-white shadow text-blue-600" : "text-gray-500"}`}
                    >
                      En Local
                    </button>
                    <button 
                      onClick={() => setTipoPedido("LLEVAR")}
                      className={`flex-1 py-1 rounded-md text-sm font-bold transition-all ${tipoPedido === "LLEVAR" ? "bg-white shadow text-purple-600" : "text-gray-500"}`}
                    >
                      Para Llevar
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista del Carrito */}
              <div className="flex-1 overflow-y-auto mb-4 border-t border-b border-gray-100 py-2">
                {carrito.length === 0 ? (
                  <div className="text-center text-gray-400 py-10 flex flex-col items-center">
                    <span className="text-4xl mb-2">🛒</span>
                    <p className="text-sm">Selecciona productos de la izquierda</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {carrito.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-bold text-gray-800">{item.nombre}</div>
                          <div className="text-xs text-gray-500">Bs. {item.precio} c/u</div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {/* CONTROLES DE CANTIDAD */}
                          <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <button 
                              onClick={() => restarDelCarrito(item.id)}
                              className="px-2 py-1 hover:bg-gray-100 text-orange-600 font-bold"
                            >-</button>
                            <span className="px-2 text-sm font-bold">{item.cantidad}</span>
                            <button 
                              onClick={() => agregarAlCarrito(item)}
                              className="px-2 py-1 hover:bg-gray-100 text-orange-600 font-bold"
                            >+</button>
                          </div>
                          
                          {/* Botón Eliminar */}
                          <button 
                            onClick={() => eliminarItem(item.id)}
                            className="text-red-400 hover:text-red-600 p-1"
                            title="Quitar todo"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total y Confirmación */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xl">
                  <span className="font-bold text-gray-800">Total:</span>
                  <span className="font-bold text-orange-600">Bs. {calcularTotalCarrito().toFixed(2)}</span>
                </div>
                <button 
                  onClick={guardarPedido}
                  className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg hover:shadow-xl active:scale-95"
                >
                  Confirmar Pedido
                </button>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}