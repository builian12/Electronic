import React from 'react';

const sales = [
  { id: 1001, client: 'cliente', total: '$1,299.99', date: '2026-08-04', status: 'Completado' },
  { id: 1002, client: 'Luis', total: '$199.50', date: '2026-08-03', status: 'Pendiente' },
  { id: 1003, client: 'Ana', total: '$1,799.00', date: '2026-08-02', status: 'Completado' },
];

export default function SalesView() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Ventas</p>
            <h1 className="text-2xl font-semibold">Resumen de ventas</h1>
          </div>
          <button className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold">Exportar</button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-t border-slate-800 bg-slate-950/70">
                  <td className="px-4 py-3">{sale.id}</td>
                  <td className="px-4 py-3">{sale.client}</td>
                  <td className="px-4 py-3">{sale.date}</td>
                  <td className="px-4 py-3">{sale.total}</td>
                  <td className="px-4 py-3">{sale.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
