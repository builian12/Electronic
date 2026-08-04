import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

export default function UsersView() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '', password: '', is_superuser: false, is_staff: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

 // #DOC CRUD USUARIOS - CARGA DE DATOS
const load = async () => {
    try {
      const res = await apiClient.get('users/');
      setUsers(res.data);
    } catch (err) {
      console.error('Error al cargar usuarios', err);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ username: '', email: '', first_name: '', last_name: '', password: '', is_superuser: false, is_staff: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    try {
      const payload = { ...form };
      if (editingId && !payload.password) delete payload.password;
      if (editingId) {
        await apiClient.put(`users/${editingId}/`, payload);
      } else {
        await apiClient.post('users/', payload);
      }
      resetForm();
      load();
    } catch (err) {
      console.error('Error al guardar usuario', err);
    }
  };

  const handleEdit = (u) => {
    setForm({
      username: u.username, email: u.email || '', first_name: u.first_name || '',
      last_name: u.last_name || '', password: '',
      is_superuser: u.is_superuser || false, is_staff: u.is_staff || false,
    });
    setEditingId(u.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
      await apiClient.delete(`users/${id}/`);
      load();
    } catch (err) {
      console.error('Error al eliminar usuario', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Usuarios</p>
            <h1 className="text-2xl font-semibold">Gestión de usuarios</h1>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold"
          >
            + Nuevo usuario
          </button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-2xl border border-gray-300 bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Editar usuario' : 'Nuevo usuario'}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Usuario</label>
                <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nombre</label>
                <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Apellido</label>
                <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Contraseña {editingId && '(dejar vacío para no cambiar)'}</label>
                <input type="password" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:border-violet-500" />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={form.is_staff}
                    onChange={(e) => setForm({ ...form, is_staff: e.target.checked })} className="rounded" /> Staff
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={form.is_superuser}
                    onChange={(e) => setForm({ ...form, is_superuser: e.target.checked })} className="rounded" /> Superuser
                </label>
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
                <th className="px-4 py-3 text-left">Usuario</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Rol</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gray-200 bg-gray-50/70">
                  <td className="px-4 py-3">{u.id}</td>
                  <td className="px-4 py-3">{u.username}</td>
                  <td className="px-4 py-3">{u.first_name} {u.last_name}</td>
                  <td className="px-4 py-3">{u.email || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${u.is_superuser ? 'bg-amber-100 text-amber-700' : u.is_staff ? 'bg-indigo-600/20 text-indigo-500' : 'bg-slate-500/20 text-gray-400'}`}>
                      {u.is_superuser ? 'Admin' : u.is_staff ? 'Staff' : 'Cliente'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleEdit(u)} className="text-indigo-600 hover:text-indigo-500"><i className="fas fa-edit"></i></button>
                    <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-700"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No hay usuarios registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}