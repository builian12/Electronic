import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

export default function SuppliersView() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    nombre: '', empresa: '', telefono: '', email: '', direccion: '', estado: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

// #DOC CRUD PROVEEDORES - CARGA DE DATOS
const load = async () => {
    try {
      const res = await apiClient.get('proveedores/');
      setSuppliers(res.data);
    } catch (err) {
      console.error('Error al cargar proveedores', err);
    }
  };

  useEffect(() => { load(); }, []);

// #DOC CRUD PROVEEDORES - LIMPIAR FORMULARIO
const resetForm = () => {
    setForm({ nombre: '', empresa: '', telefono: '', email: '', direccion: '', estado: true });
    setEditingId(null);
    setShowForm(false);
  };

// #DOC CRUD PROVEEDORES - GUARDAR
const handleSave = async () => {
    try {
      if (editingId) {
        await apiClient.put(`proveedores/${editingId}/`, form);
      } else {
        await apiClient.post('proveedores/', form);
      }
      resetForm();
      load();
    } catch (err) {
      console.error('Error al guardar proveedor', err);
    }
  };

  const handleEdit = (s) => {
    setForm({
      nombre: s.nombre, empresa: s.empresa || '', telefono: s.telefono || '',
      email: s.email || '', direccion: s.direccion || '', estado: s.estado,
    });
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este proveedor?')) return;
    try {
      await apiClient.delete(`proveedores/${id}/`);
      load();
    } catch (err) {
      console.error('Error al eliminar proveedor', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Proveedores</p>
            <h1 className="text-2xl font-semibold">Gestión de proveedores</h1>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold"
          >
            + Nuevo proveedor
          </button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-2xl border border-gray-300 bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Editar proveedor' : 'Nuevo proveedor'}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nombre</label>
                <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-fuchsia-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Empresa</label>
                <input value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-fuchsia-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
                <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-fuchsia-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-fuchsia-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Dirección</label>
                <input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-fuchsia-500" />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Activo</label>
                <input type="checkbox" checked={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.checked })} className="rounded" />
              </div>
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
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Empresa</th>
                <th className="px-4 py-3 text-left">Teléfono</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} className="border-t border-gray-200 bg-gray-50/70">
                  <td className="px-4 py-3">{s.id}</td>
                  <td className="px-4 py-3">{s.nombre}</td>
                  <td className="px-4 py-3">{s.empresa || '—'}</td>
                  <td className="px-4 py-3">{s.telefono || '—'}</td>
                  <td className="px-4 py-3">{s.email || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${s.estado ? 'bg-indigo-600/20 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {s.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleEdit(s)} className="text-indigo-600 hover:text-indigo-500"><i className="fas fa-edit"></i></button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-700"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No hay proveedores registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}