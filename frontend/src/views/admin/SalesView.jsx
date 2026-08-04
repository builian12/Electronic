import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

export default function SalesView() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    usuario: '', estado: 'Pendiente', total_venta: '',
    detalles: [{ producto: '', cantidad: 1, precio_unitario_historico: '', subtotal: '' }],
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

// #DOC CRUD VENTAS - CARGA DE DATOS
const load = async () => {
    try {
      const [ventasRes, prodRes, userRes] = await Promise.all([
        apiClient.get('ventas/'),
        apiClient.get('productos/'),
        apiClient.get('users/'),
      ]);
      setSales(ventasRes.data);
      setProducts(prodRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error('Error al cargar ventas', err);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({
      usuario: '', estado: 'Pendiente', total_venta: '',
      detalles: [{ producto: '', cantidad: 1, precio_unitario_historico: '', subtotal: '' }],
    });
    setEditingId(null);
    setShowForm(false);
  };

// #DOC CRUD VENTAS - GUARDAR
const handleSave = async () => {
    try {
      const payload = {
        usuario: form.usuario,
        estado: form.estado,
        total_venta: form.total_venta,
        detalles: form.detalles.map(d => ({
          producto: d.producto,
          cantidad: parseInt(d.cantidad) || 1,
          precio_unitario_historico: d.precio_unitario_historico,
          subtotal: d.subtotal,
        })),
      };
      if (editingId) {
        // Ventas solo permite PUT básico sin detalles; omitimos por simplicidad
        await apiClient.put(`ventas/${editingId}/`, { usuario: payload.usuario, estado: payload.estado, total_venta: payload.total_venta });
      } else {
        await apiClient.post('ventas/', payload);
      }
      resetForm();
      load();
    } catch (err) {
      console.error('Error al guardar venta', err);
    }
  };

  const handleEdit = (v) => {
    const detalles = v.detalles && v.detalles.length ? v.detalles.map(d => ({
      producto: d.producto && typeof d.producto === 'object' ? d.producto.id : d.producto,
      cantidad: d.cantidad,
      precio_unitario_historico: d.precio_unitario_historico,
      subtotal: d.subtotal,
    })) : [{ producto: '', cantidad: 1, precio_unitario_historico: '', subtotal: '' }];
    setForm({
      usuario: v.usuario && typeof v.usuario === 'object' ? v.usuario.id : v.usuario,
      estado: v.estado,
      total_venta: v.total_venta,
      detalles,
    });
    setEditingId(v.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta venta?')) return;
    try {
      await apiClient.delete(`ventas/${id}/`);
      load();
    } catch (err) {
      console.error('Error al eliminar venta', err);
    }
  };

  const addDetail = () => {
    setForm({
      ...form,
      detalles: [...form.detalles, { producto: '', cantidad: 1, precio_unitario_historico: '', subtotal: '' }],
    });
  };

  const removeDetail = (idx) => {
    if (form.detalles.length <= 1) return;
    setForm({ ...form, detalles: form.detalles.filter((_, i) => i !== idx) });
  };

  const updateDetail = (idx, field, value) => {
    const updated = form.detalles.map((d, i) => {
      if (i !== idx) return d;
      const next = { ...d, [field]: value };
      if (field === 'producto') {
        const prod = products.find(p => p.id === parseInt(value) || (typeof value === 'object' && p.id === value.id));
        if (prod) {
          next.precio_unitario_historico = prod.precio_unitario;
          next.subtotal = (parseFloat(prod.precio_unitario) * (parseInt(next.cantidad) || 1)).toFixed(2);
        }
      }
      if (field === 'cantidad') {
        const precio = next.precio_unitario_historico || 0;
        next.subtotal = (parseFloat(precio) * (parseInt(value) || 0)).toFixed(2);
      }
      return next;
    });
    const total = updated.reduce((sum, d) => sum + parseFloat(d.subtotal || 0), 0).toFixed(2);
    setForm({ ...form, detalles: updated, total_venta: total });
  };

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'Completado': return 'bg-indigo-600/20 text-emerald-700';
      case 'Pendiente': return 'bg-amber-100 text-amber-700';
      case 'Cancelado': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-500/20 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-7xl mx-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Ventas</p>
            <h1 className="text-2xl font-semibold">Resumen de ventas</h1>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold"
          >
            + Nueva venta
          </button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-2xl border border-gray-300 bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Editar venta' : 'Nueva venta'}
            </h2>
            <div className="grid gap-4 md:grid-cols-3 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Cliente</label>
                <select value={form.usuario} onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-emerald-500">
                  <option value="">Seleccionar...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.username} {u.first_name && `(${u.first_name})`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Estado</label>
                <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-emerald-500">
                  <option value="Pendiente">Pendiente</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Total venta</label>
                <input type="number" step="0.01" value={form.total_venta} readOnly
                  className="w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-2 outline-none text-gray-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-600 font-semibold">Detalles</label>
                <button onClick={addDetail} className="text-xs text-indigo-600 hover:text-indigo-500">
                  + Agregar producto
                </button>
              </div>
              {form.detalles.map((det, idx) => (
                <div key={idx} className="grid gap-3 md:grid-cols-4 mb-3 p-3 rounded-xl border border-gray-300 bg-white/50">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Producto</label>
                    <select value={det.producto} onChange={(e) => updateDetail(idx, 'producto', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500">
                      <option value="">Seleccionar...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.nombre} (${p.precio_unitario})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Cantidad</label>
                    <input type="number" min="1" value={det.cantidad}
                      onChange={(e) => updateDetail(idx, 'cantidad', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Precio U.</label>
                    <input type="number" step="0.01" value={det.precio_unitario_historico} readOnly
                      className="w-full rounded-lg border border-gray-300 bg-white/50 px-3 py-1.5 text-sm outline-none text-gray-400" />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">Subtotal</label>
                      <input type="number" step="0.01" value={det.subtotal} readOnly
                        className="w-full rounded-lg border border-gray-300 bg-white/50 px-3 py-1.5 text-sm outline-none text-gray-400" />
                    </div>
                    <button onClick={() => removeDetail(idx)}
                      className="text-red-600 hover:text-red-700 pb-1"><i className="fas fa-times"></i></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSave} className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-semibold">
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
              <button onClick={resetForm} className="rounded-xl border border-gray-300 px-6 py-2 text-sm">Cancelar</button>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((v) => (
                <tr key={v.id} className="border-t border-gray-200 bg-gray-50/70">
                  <td className="px-4 py-3">{v.id}</td>
                  <td className="px-4 py-3">
                    {v.usuario && typeof v.usuario === 'object' ? v.usuario.username : v.usuario}
                  </td>
                  <td className="px-4 py-3">{v.fecha_venta ? new Date(v.fecha_venta).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">$ {parseFloat(v.total_venta).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${getStatusBadge(v.estado)}`}>
                      {v.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleEdit(v)} className="text-indigo-600 hover:text-indigo-500"><i className="fas fa-edit"></i></button>
                    <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:text-red-700"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No hay ventas registradas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}