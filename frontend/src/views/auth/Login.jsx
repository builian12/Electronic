import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { login } from '../../services/authService';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(username, password);
      if (data.access) {
        history.push(username === 'admin' ? '/dashboard' : '/store');
      }
    } catch (err) {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 shadow-lg shadow-indigo-500/30 mb-4">
            <i className="fas fa-bolt text-white text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Electronic</h1>
          <p className="text-gray-500 mt-1 text-sm">Sistema de gestión de inventario</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-user text-gray-400 text-sm"></i>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Nombre de usuario"
                  className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400 text-sm"></i>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-3 px-4 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i> Ingresando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400">o también</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              ¿No tienes cuenta?{' '}
              <Link to="/auth/register" className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white/80 px-4 py-3 shadow-sm">
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Credenciales de prueba</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-indigo-50 px-3 py-2 border border-indigo-100">
              <p className="text-indigo-700 font-semibold">Admin</p>
              <p className="text-gray-500 mt-0.5">admin / Admin123!</p>
            </div>
            <div className="rounded-lg bg-emerald-50 px-3 py-2 border border-emerald-100">
              <p className="text-emerald-700 font-semibold">Cliente</p>
              <p className="text-gray-500 mt-0.5">cliente / Cliente123!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}