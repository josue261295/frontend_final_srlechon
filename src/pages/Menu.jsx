import { useState, useEffect } from 'react';

export default function Menu() {
  // --- ESTADOS DEL ALMUERZO ---
  const [precioAlmuerzo, setPrecioAlmuerzo] = useState(15.00);
  const [nombreSopa, setNombreSopa] = useState("Sopa de Maní");
  
  // Control de cuántas opciones de segundos habrá hoy
  const [cantidadOpciones, setCantidadOpciones] = useState(2); 
  const [segundos, setSegundos] = useState([
    { id: 1, nombre: "Sajta de Pollo", stock: 25 },
    { id: 2, nombre: "Falso Conejo", stock: 30 },
  ]);

  // --- ESTADOS DE EXTRAS ---
  const [extras, setExtras] = useState([
    { id: 1, nombre: "Plato Extra de Lechón", precio: 50.00 },
    { id: 2, nombre: "Trucha Frita", precio: 40.00 }
  ]);

  // --- LÓGICA DE SEGUNDOS ---
  
  // Cuando cambias el número de opciones (ej: de 2 a 3)
  const actualizarCantidadOpciones = (nuevaCantidad) => {
    const cantidad = parseInt(nuevaCantidad);
    setCantidadOpciones(cantidad);

    // Ajustamos el array de segundos para que coincida con la cantidad
    const nuevosSegundos = [...segundos];
    if (cantidad > segundos.length) {
      // Si aumentamos, agregamos filas vacías
      for (let i = segundos.length; i < cantidad; i++) {
        nuevosSegundos.push({ id: Date.now() + i, nombre: "", stock: 0 });
      }
    } else {
      // Si reducimos, cortamos el array
      nuevosSegundos.length = cantidad;
    }
    setSegundos(nuevosSegundos);
  };

  const editarSegundo = (index, campo, valor) => {
    const nuevos = [...segundos];
    nuevos[index][campo] = valor;
    setSegundos(nuevos);
  };

  // --- LÓGICA DE EXTRAS ---
  const agregarExtra = () => {
    setExtras([...extras, { id: Date.now(), nombre: "", precio: 0 }]);
  };

  const editarExtra = (id, campo, valor) => {
    setExtras(extras.map(e => e.id === id ? { ...e, [campo]: valor } : e));
  };

  const eliminarExtra = (id) => {
    setExtras(extras.filter(e => e.id !== id));
  };

  const guardarMenu = () => {
    console.log("Guardando menú del día...", {
        precioAlmuerzo,
        nombreSopa,
        segundos,
        extras
    });
    alert("¡Menú del día y stock actualizado correctamente!");
  };

  return (
    <div className="p-8 max-w-6xl mx-auto pb-20">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">Configurar Menú del Día</h1>
          <p className="text-gray-500">Define los platos, precios y stock disponible para hoy.</p>
        </div>
        <button 
          onClick={guardarMenu}
          className="w-full md:w-auto bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <span>💾</span> Guardar y Publicar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* --- SECCIÓN 1: ALMUERZO FAMILIAR --- */}
        <div className="bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden">
          <div className="bg-orange-50 p-6 border-b border-orange-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-orange-800 flex items-center gap-2">
              🥘 Almuerzo Completo
            </h2>
            <div className="bg-white px-4 py-2 rounded-lg border border-orange-200 shadow-sm flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Precio Único:</span>
              <span className="text-orange-600 font-bold">Bs.</span>
              <input 
                type="number" 
                className="w-16 font-extrabold text-xl text-orange-700 outline-none border-b border-orange-300 focus:border-orange-600 text-right bg-transparent"
                value={precioAlmuerzo}
                onChange={(e) => setPrecioAlmuerzo(e.target.value)}
              />
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            {/* SOPA */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">
                1. La Sopa de Hoy
              </label>
              <input 
                type="text" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition"
                placeholder="Ej: Sopa de Maní"
                value={nombreSopa}
                onChange={(e) => setNombreSopa(e.target.value)}
              />
            </div>

            <hr className="border-gray-100" />

            {/* SEGUNDOS */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  2. Segundos y Cantidades
                </label>
                
                {/* Selector de Cantidad de Opciones */}
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                  <span className="text-xs font-bold text-blue-800">¿Cuántas opciones hay hoy?</span>
                  <select 
                    className="bg-white border border-blue-200 text-blue-900 text-sm rounded font-bold outline-none cursor-pointer"
                    value={cantidadOpciones}
                    onChange={(e) => actualizarCantidadOpciones(e.target.value)}
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                {segundos.map((plato, index) => (
                  <div key={plato.id} className="flex gap-3 items-center animate-fade-in">
                    <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {index + 1}
                    </span>
                    
                    {/* Nombre del Segundo */}
                    <div className="flex-1">
                      <input 
                        type="text" 
                        placeholder="Nombre del plato (ej: Sajta)"
                        className="w-full p-2 rounded-lg border border-gray-300 text-sm focus:border-orange-500 outline-none"
                        value={plato.nombre}
                        onChange={(e) => editarSegundo(index, 'nombre', e.target.value)}
                      />
                    </div>

                    {/* Stock */}
                    <div className="w-24">
                      <div className="relative">
                        <input 
                          type="number" 
                          placeholder="0"
                          className="w-full p-2 pr-8 rounded-lg border border-gray-300 text-sm font-bold text-center focus:border-blue-500 outline-none"
                          value={plato.stock}
                          onChange={(e) => editarSegundo(index, 'stock', e.target.value)}
                        />
                        <span className="absolute right-2 top-2 text-xs text-gray-400 font-bold">und</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                * Ingresa la cantidad exacta que cocinaste de cada plato.
              </p>
            </div>

          </div>
        </div>

        {/* --- SECCIÓN 2: EXTRAS INDEPENDIENTES --- */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-full">
          <div className="bg-gray-50 p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              ⭐ Platos Extras
            </h2>
            <button 
              onClick={agregarExtra}
              className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 transition"
            >
              + Nuevo Extra
            </button>
          </div>

          <div className="p-6 flex-1 bg-white space-y-4">
            {extras.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                No hay platos extras hoy.
              </div>
            ) : (
              extras.map((extra) => (
                <div key={extra.id} className="flex gap-3 items-center group">
                  
                  {/* Nombre Extra */}
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Nombre del Plato</label>
                    <input 
                      type="text" 
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:border-green-500 outline-none"
                      value={extra.nombre}
                      onChange={(e) => editarExtra(extra.id, 'nombre', e.target.value)}
                    />
                  </div>

                  {/* Precio Extra */}
                  <div className="w-24">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Precio</label>
                    <div className="relative">
                      <span className="absolute left-2 top-2 text-gray-400 text-xs">Bs.</span>
                      <input 
                        type="number" 
                        className="w-full p-2 pl-8 rounded-lg border border-gray-200 text-sm font-bold focus:border-green-500 outline-none"
                        value={extra.precio}
                        onChange={(e) => editarExtra(extra.id, 'precio', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Botón Borrar */}
                  <div className="mt-4">
                    <button 
                      onClick={() => eliminarExtra(extra.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                      title="Eliminar plato"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Estos platos tienen precio individual y no incluyen la sopa del almuerzo.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}