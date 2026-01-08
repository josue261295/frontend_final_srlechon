import { useState } from 'react';

export default function Menu() {
  // CONFIGURACIÓN DEL ALMUERZO
  const [precioAlmuerzo, setPrecioAlmuerzo] = useState(15);
  const [sopa, setSopa] = useState("Sopa de Maní");
  const [segundos, setSegundos] = useState([
    "Lechón al Horno",
    "Picante Mixto",
    "Saice Tarijeño",
    "Milanesa de Pollo"
  ]);

  // EXTRAS (Platos fuera del almuerzo común)
  const [extras, setExtras] = useState([
    { id: 1, nombre: "Plato Extra de Lechón", precio: 45 },
    { id: 2, nombre: "Trucha Frita", precio: 35 }
  ]);

  // BEBIDAS / REFRESCOS
  const [bebidas, setBebidas] = useState([
    { id: 1, marca: "Coca Cola", tamano: "Personal", precio: 5 },
    { id: 2, marca: "Coca Cola", tamano: "2 Litros", precio: 16 },
    { id: 3, marca: "Fanta", tamano: "2.5 Litros", precio: 18 },
    { id: 4, marca: "Jarra Mocochinchi", tamano: "Jarra", precio: 15 },
  ]);

  // --- FUNCIONES PARA EDITAR ---
  const handleSegundoChange = (index, valor) => {
    const nuevos = [...segundos];
    nuevos[index] = valor;
    setSegundos(nuevos);
  };

  const agregarSegundo = () => {
    if(segundos.length < 5) setSegundos([...segundos, "Nuevo Plato"]);
  };

  const quitarSegundo = () => {
    if(segundos.length > 1) {
      const nuevos = [...segundos];
      nuevos.pop();
      setSegundos(nuevos);
    }
  };

  const guardarCambios = () => {
    // Aquí se enviaría a la Base de Datos
    alert("¡Menú del día actualizado correctamente!");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Configuración del Menú Diario</h1>
          <p className="text-gray-500">Define qué se servirá hoy en el restaurante</p>
        </div>
        <button 
          onClick={guardarCambios}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg transition transform hover:scale-105"
        >
          💾 Guardar Todo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* --- SECCIÓN 1: EL ALMUERZO FAMILIAR --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
            <h2 className="text-xl font-bold text-orange-600 flex items-center gap-2">
              🥘 Almuerzo Ejecutivo
            </h2>
            <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-lg">
              <span className="text-sm font-bold text-gray-600">Precio General: Bs.</span>
              <input 
                type="number" 
                value={precioAlmuerzo}
                onChange={(e) => setPrecioAlmuerzo(e.target.value)}
                className="w-16 bg-white border border-gray-300 rounded px-1 font-bold text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Sopa del Día</label>
              <input 
                type="text" 
                value={sopa}
                onChange={(e) => setSopa(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-800 focus:bg-white focus:border-orange-500 outline-none transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-400 uppercase">Segundos ({segundos.length})</label>
                <div className="flex gap-2">
                  <button onClick={quitarSegundo} className="text-gray-400 hover:text-red-500 font-bold px-2 border border-gray-200 rounded">-</button>
                  <button onClick={agregarSegundo} className="text-orange-500 hover:text-orange-700 font-bold px-2 border border-orange-200 rounded bg-orange-50">+</button>
                </div>
              </div>
              
              <div className="space-y-2">
                {segundos.map((plato, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-gray-400 font-bold text-sm w-4">#{index+1}</span>
                    <input 
                      type="text" 
                      value={plato}
                      onChange={(e) => handleSegundoChange(index, e.target.value)}
                      className="flex-1 p-2 border border-gray-200 rounded-lg focus:border-orange-500 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- SECCIÓN 2: EXTRAS Y BEBIDAS --- */}
        <div className="space-y-8">
          
          {/* EXTRAS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">⭐ Platos Extras</h2>
            <div className="space-y-3">
              {extras.map((extra) => (
                <div key={extra.id} className="flex gap-2">
                  <input type="text" defaultValue={extra.nombre} className="flex-1 p-2 bg-gray-50 rounded border border-gray-200 text-sm" />
                  <div className="flex items-center">
                    <span className="text-gray-400 text-xs mr-1">Bs.</span>
                    <input type="number" defaultValue={extra.precio} className="w-16 p-2 bg-white border border-gray-200 rounded text-sm font-bold" />
                  </div>
                </div>
              ))}
              <button className="w-full py-2 text-sm text-blue-600 font-bold border border-dashed border-blue-200 rounded-lg hover:bg-blue-50">
                + Agregar Extra
              </button>
            </div>
          </div>

          {/* BEBIDAS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">🥤 Bebidas y Refrescos</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {bebidas.map((bebida) => (
                <div key={bebida.id} className="flex gap-2 items-center text-sm">
                  <input type="text" defaultValue={bebida.marca} className="w-1/3 p-2 bg-gray-50 rounded border border-gray-200" placeholder="Marca" />
                  <input type="text" defaultValue={bebida.tamano} className="w-1/3 p-2 bg-gray-50 rounded border border-gray-200" placeholder="Tamaño" />
                  <div className="flex items-center w-1/4">
                    <span className="text-gray-400 text-xs mr-1">Bs.</span>
                    <input type="number" defaultValue={bebida.precio} className="w-full p-2 bg-white border border-gray-200 rounded font-bold" />
                  </div>
                </div>
              ))}
              <button className="w-full py-2 text-sm text-green-600 font-bold border border-dashed border-green-200 rounded-lg hover:bg-green-50">
                + Agregar Bebida
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}