import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

export default function ProductView() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio_unitario: '', stock_disponible: 0,
    categoria: '', estado: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // #DOC CRUD PRODUCTOS - CARGA DE DATOS
  // Trae productos y categorías desde la API al iniciar el componente
  const load = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        apiClient.get('productos/'),
        apiClient.get('categorias/'),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error('Error al cargar productos', err);
    }
  };

  useEffect(() => { load(); }, []);

// #DOC CRUD PRODUCTOS - LIMPIAR FORMULARIO
  // Reinicia el formulario y cierra el modo edición/creación
  const resetForm = () => {
    setForm({ nombre: '', descripcion: '', precio_unitario: '', stock_disponible: 0, categoria: '', estado: true });
    setEditingId(null);
    setShowForm(false);
  };

// #CAMBIO CRUD PRODUCTOS BOTON GUARDAR
  // Aquí está la función que ejecuta el botón "Guardar" (Crear/Actualizar producto)
  const handleSave = async () => {
    try {
      const payload = { ...form };
      if (editingId) {
        await apiClient.put(`productos/${editingId}/`, payload);
      } else {
        await apiClient.post('productos/', payload);
      }
      resetForm();
      load();
    } catch (err) {
      console.error('Error al guardar producto', err);
    }
  };
  
// #DOC CRUD PRODUCTOS - EDITAR
  // Carga los datos del producto seleccionado en el formulario para editarlo
  const handleEdit = (p) => {
    setForm({
      nombre: p.nombre, descripcion: p.descripcion || '',
      precio_unitario: p.precio_unitario, stock_disponible: p.stock_disponible,
      categoria: p.categoria && typeof p.categoria === 'object' ? p.categoria.id : p.categoria,
      estado: p.estado,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

// #DOC CRUD PRODUCTOS - ELIMINAR
  // Pide confirmación y elimina el producto de la base de datos
  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await apiClient.delete(`productos/${id}/`);
      load();
    } catch (err) {
      console.error('Error al eliminar producto', err);
    }
  };

  const getCategoryName = (catId) => {
    if (typeof catId === 'object' && catId !== null) return catId.nombre;
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.nombre : '—';
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Inventario</p>
            <h1 className="text-2xl font-semibold">Productos</h1>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold"
          >
            + Nuevo producto
          </button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-2xl border border-gray-300 bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nombre</label>
                <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-indigo-600" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Categoría</label>
                <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-indigo-600">
                  <option value="">Seleccionar...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Precio unitario</label>
                <input type="number" step="0.01" value={form.precio_unitario}
                  onChange={(e) => setForm({ ...form, precio_unitario: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-indigo-600" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Stock</label>
                <input type="number" value={form.stock_disponible}
                  onChange={(e) => setForm({ ...form, stock_disponible: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-indigo-600" />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Descripción</label>
                <input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-indigo-600" />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Activo</label>
                <input type="checkbox" checked={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.checked })} className="rounded" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              {/* #CAMBIO CRUD PRODUCTOS BOTON GUARDAR */}
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
                <th className="px-4 py-3 text-left">Producto</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Precio</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-gray-200 bg-gray-50/70">
                  <td className="px-4 py-3">{p.id}</td>
                  <td className="px-4 py-3">{p.nombre}</td>
                  <td className="px-4 py-3">{getCategoryName(p.categoria)}</td>
                  <td className="px-4 py-3">{p.stock_disponible}</td>
                  <td className="px-4 py-3">$ {parseFloat(p.precio_unitario).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${p.estado ? 'bg-indigo-600/20 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {p.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleEdit(p)} className="text-indigo-600 hover:text-indigo-500"><i className="fas fa-edit"></i></button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-700"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No hay productos registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}