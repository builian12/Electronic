import React from 'react';

const stats = [
  { title: 'Ventas hoy', value: '$ 6,240', icon: 'fas fa-money-bill-wave', color: 'bg-emerald-500' },
  { title: 'Productos activos', value: '24', icon: 'fas fa-box', color: 'bg-sky-500' },
  { title: 'Stock bajo', value: '3', icon: 'fas fa-exclamation-triangle', color: 'bg-amber-500' },
  { title: 'Usuarios', value: '18', icon: 'fas fa-users', color: 'bg-violet-500' },
];

const recentSales = [
  { id: 1, client: 'cliente', item: 'Laptop Dell Latitude', total: '$ 1,299.99', status: 'Completado' },
  { id: 2, client: 'Luis', item: 'Monitor 24', total: '$ 199.50', status: 'Pendiente' },
  { id: 3, client: 'Ana', item: 'PC Gamer Ryzen', total: '$ 1,799.00', status: 'Completado' },
];

export default function DashboardView() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Panel ejecutivo</p>
              <h1 className="text-3xl font-semibold">Gestión de inventario y ventas</h1>
              <p className="text-slate-400 mt-2">Control en tiempo real de stock, ventas y clientes.</p>
            </div>
            <div className="rounded-2xl border border-sky-700/40 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
              <div className="font-semibold">Estado del negocio</div>
              <div>Operación estable · 24 productos disponibles</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{item.title}</p>
                  <p className="text-2xl font-semibold mt-2">{item.value}</p>
                </div>
                <div className={`rounded-2xl p-3 text-white ${item.color}`}>
                  <i className={item.icon}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid xl:grid-cols-[1.3fr_0.7fr] gap-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Ventas recientes</h2>
              <button className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">Ver todas</button>
            </div>
            <div className="space-y-3">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                  <div>
                    <div className="font-medium">{sale.item}</div>
                    <div className="text-sm text-slate-400">Cliente: {sale.client}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{sale.total}</div>
                    <div className="text-sm text-emerald-400">{sale.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Accesos rápidos</h2>
            <div className="space-y-3 text-sm">
              <a href="/dashboard/productos" className="block rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 hover:border-sky-500">Gestionar productos</a>
              <a href="/dashboard/ventas" className="block rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 hover:border-sky-500">Ver ventas</a>
              <a href="/dashboard/usuarios" className="block rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 hover:border-sky-500">Administrar usuarios</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
