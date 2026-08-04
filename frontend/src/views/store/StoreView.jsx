import React from 'react';

const products = [
  { name: 'Laptop Dell Latitude', price: '$ 1,299.99', stock: '8 disponibles', description: 'Ideal para oficina y negocio con batería confiable.' },
  { name: 'PC Gamer Ryzen', price: '$ 1,799.00', stock: '5 disponibles', description: 'Potente para diseño, edición y gaming.' },
  { name: 'Monitor 24', price: '$ 199.50', stock: '15 disponibles', description: 'Pantalla Full HD con excelente color y brillo.' },
  { name: 'Teclado Mecánico RGB', price: '$ 129.90', stock: '24 disponibles', description: 'Respuesta rápida y diseño ergonómico.' },
  { name: 'Mouse Logitech G502', price: '$ 89.99', stock: '30 disponibles', description: 'Precisión y personalización para trabajo o juego.' },
];

export default function StoreView() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-sky-700 to-violet-700 p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-100">Tienda de equipos</p>
          <h1 className="text-3xl font-semibold mt-2">Compra equipos informáticos con confianza</h1>
          <p className="text-slate-100/90 mt-3">Catálogo de productos, stock disponible y checkout simple para clientes.</p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
          {products.map((product) => (
            <div key={product.name} className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl">
              <div className="h-32 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 mb-4" />
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-slate-400 text-sm mt-2">{product.description}</p>
              <div className="flex items-center justify-between mt-5">
                <div>
                  <div className="text-lg font-semibold">{product.price}</div>
                  <div className="text-sm text-emerald-400">{product.stock}</div>
                </div>
                <button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white">Comprar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
