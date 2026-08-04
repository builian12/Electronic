import React from 'react';

const products = [
  { name: 'Laptop Dell Latitude', category: 'Laptops', stock: 8, price: '$1,299.99' },
  { name: 'PC Gamer Ryzen', category: 'Desktop', stock: 5, price: '$1,799.00' },
  { name: 'Monitor 24', category: 'Periféricos', stock: 15, price: '$199.50' },
];

export default function ProductView() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Inventario</p>
            <h1 className="text-2xl font-semibold">Productos</h1>
          </div>
          <button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold">+ Nuevo producto</button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left">Producto</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Precio</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.name} className="border-t border-slate-800 bg-slate-950/70">
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">{product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
