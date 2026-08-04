import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

export default function DashboardView() {
  const [stats, setStats] = useState({
    ventas: 0,
    totalVentas: 0,
    productos: 0,
    proveedores: 0,
    clientes: 0,
    usuarios: 0,
    categorias: 0,
  });
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

// #DOC DASHBOARD - CARGA DE ESTADISTICAS
const load = async () => {
    try {
      const [ventasRes, productosRes, proveedoresRes, clientesRes, usuariosRes, categoriasRes] = await Promise.all([
        apiClient.get('ventas/'),
        apiClient.get('productos/'),
        apiClient.get('proveedores/'),
        apiClient.get('clientes/'),
        apiClient.get('users/'),
        apiClient.get('categorias/'),
      ]);

      const ventas = ventasRes.data;
      const totalVentas = ventas.reduce((sum, v) => sum + parseFloat(v.total_venta || 0), 0);

      setStats({
        ventas: ventas.length,
        totalVentas: totalVentas.toFixed(2),
        productos: productosRes.data.length,
        proveedores: proveedoresRes.data.length,
        clientes: clientesRes.data.length,
        usuarios: usuariosRes.data.length,
        categorias: categoriasRes.data.length,
      });

      const sorted = [...ventas].sort((a, b) => new Date(b.fecha_venta) - new Date(a.fecha_venta)).slice(0, 5);
      setRecentSales(sorted);
    } catch (err) {
      console.error('Error al cargar dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const statCards = [
    { title: 'Ventas del mes', value: `$${stats.totalVentas}`, icon: 'fas fa-money-bill-wave', color: 'bg-emerald-500' },
    { title: 'Productos activos', value: stats.productos, icon: 'fas fa-box', color: 'bg-indigo-500' },
    { title: 'Proveedores', value: stats.proveedores, icon: 'fas fa-truck', color: 'bg-amber-500' },
    { title: 'Usuarios', value: stats.usuarios, icon: 'fas fa-users', color: 'bg-rose-500' },
  ];

  const getUsername = (usuario) => {
    if (usuario && typeof usuario === 'object') return usuario.username;
    return usuario;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-600 font-semibold">Panel ejecutivo</p>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de inventario y ventas</h1>
              <p className="text-gray-500 mt-2">Datos en tiempo real desde PostgreSQL.</p>
            </div>
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-gray-700">
              <div className="font-semibold text-indigo-700">Estado del negocio</div>
              <div>Operación estable · {stats.productos} productos disponibles</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <i className="fas fa-spinner fa-spin text-3xl text-indigo-600 mb-3"></i>
            <p className="text-gray-500">Cargando dashboard...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              {statCards.map((item) => (
                <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">{item.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{item.value}</p>
                    </div>
                    <div className={`rounded-xl p-3 text-white ${item.color}`}>
                      <i className={item.icon}></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid xl:grid-cols-[1.3fr_0.7fr] gap-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Ventas recientes</h2>
                  <span className="badge rounded-full bg-indigo-100 text-indigo-700 px-3 py-1 text-xs font-medium">
                    {stats.ventas} ventas totales
                  </span>
                </div>
                <div className="space-y-3">
                  {recentSales.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No hay ventas registradas.</p>
                  ) : (
                    recentSales.map((sale) => (
                      <div key={sale.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-800">Venta #{sale.id}</div>
                          <div className="text-sm text-gray-500">
                            Cliente: {getUsername(sale.usuario)} · {sale.fecha_venta ? new Date(sale.fecha_venta).toLocaleDateString() : '—'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">$ {parseFloat(sale.total_venta).toFixed(2)}</div>
                          <div className={`text-sm font-medium ${sale.estado === 'Completado' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {sale.estado}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <span className="text-sm text-gray-600"><i className="fas fa-tags mr-2 text-indigo-500"></i>Categorías</span>
                    <span className="font-bold text-gray-900">{stats.categorias}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <span className="text-sm text-gray-600"><i className="fas fa-box mr-2 text-indigo-500"></i>Productos</span>
                    <span className="font-bold text-gray-900">{stats.productos}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <span className="text-sm text-gray-600"><i className="fas fa-truck mr-2 text-indigo-500"></i>Proveedores</span>
                    <span className="font-bold text-gray-900">{stats.proveedores}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <span className="text-sm text-gray-600"><i className="fas fa-address-book mr-2 text-indigo-500"></i>Clientes</span>
                    <span className="font-bold text-gray-900">{stats.clientes}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <span className="text-sm text-gray-600"><i className="fas fa-users mr-2 text-indigo-500"></i>Usuarios</span>
                    <span className="font-bold text-gray-900">{stats.usuarios}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <span className="text-sm text-gray-600"><i className="fas fa-money-bill-wave mr-2 text-emerald-500"></i>Ventas</span>
                    <span className="font-bold text-gray-900">{stats.ventas}</span>
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Accesos rápidos</h2>
                <div className="space-y-2 text-sm">
                  <a href="/dashboard/productos" className="block rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 transition-colors">Gestionar productos</a>
                  <a href="/dashboard/ventas" className="block rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 transition-colors">Ver ventas</a>
                  <a href="/dashboard/proveedores" className="block rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 transition-colors">Administrar proveedores</a>
                  <a href="/dashboard/clientes" className="block rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 transition-colors">Administrar clientes</a>
                  <a href="/dashboard/usuarios" className="block rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 transition-colors">Administrar usuarios</a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}