import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

export default function CategoriesView() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '', estado: true });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

// #DOC CRUD CATEGORIAS - CARGA DE DATOS
  // Trae la lista de categorías desde la API
  const load = async () => {
    try {
      const res = await apiClient.get('categorias/');
      setCategories(res.data);
    } catch (err) {
      console.error('Error al cargar categorías', err);
    }
  };

  useEffect(() => { load(); }, []);

// #DOC CRUD CATEGORIAS - LIMPIAR FORMULARIO
  // Reinicia el formulario y cierra el modo edición/creación
  const resetForm = () => {
    setForm({ nombre: '', descripcion: '', estado: true });
    setEditingId(null);
    setShowForm(false);
  };

// #DOC CRUD CATEGORIAS - GUARDAR
  // Crea o actualiza una categoría según si hay editingId
  const handleSave = async () => {
    try {
      if (editingId) {
        await apiClient.put(`categorias/${editingId}/`, form);
      } else {
        await apiClient.post('categorias/', form);
      }
      resetForm();
      load();
    } catch (err) {
      console.error('Error al guardar categoría', err);
    }
  };

// #DOC CRUD CATEGORIAS - EDITAR
  // Carga los datos de la categoría seleccionada en el formulario
  const handleEdit = (cat) => {
    setForm({ nombre: cat.nombre, descripcion: cat.descripcion || '', estado: cat.estado });
    setEditingId(cat.id);
    setShowForm(true);
  };

// #DOC CRUD CATEGORIAS - ELIMINAR
  // Pide confirmación y elimina la categoría
  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await apiClient.delete(`categorias/${id}/`);
      load();
    } catch (err) {
      console.error('Error al eliminar categoría', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Categorías</p>
            <h1 className="text-2xl font-semibold">Gestión de categorías</h1>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold"
          >
            + Nueva categoría
          </button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-2xl border border-gray-300 bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Editar categoría' : 'Nueva categoría'}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nombre</label>
                <input
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Descripción</label>
                <input
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-orange-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Activo</label>
                <input
                  type="checkbox"
                  checked={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.checked })}
                  className="rounded"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSave} className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-semibold">
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
              <button onClick={resetForm} className="rounded-xl border border-gray-300 px-6 py-2 text-sm">
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Descripción</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t border-gray-200 bg-gray-50/70">
                  <td className="px-4 py-3">{cat.id}</td>
                  <td className="px-4 py-3">{cat.nombre}</td>
                  <td className="px-4 py-3">{cat.descripcion || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${cat.estado ? 'bg-indigo-600/20 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {cat.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleEdit(cat)} className="text-indigo-600 hover:text-indigo-500">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-700">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No hay categorías registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}