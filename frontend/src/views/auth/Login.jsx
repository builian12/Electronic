import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { login } from '../../services/authService';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      if (data.access) {
        history.push(username === 'admin' ? '/dashboard' : '/store');
      }
    } catch (err) {
      setError('Credenciales inválidas. Prueba con admin / Admin123! o cliente / Cliente123!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Electronic</p>
          <h1 className="text-2xl font-semibold mt-2">Iniciar sesión</h1>
          <p className="text-slate-400 mt-2">Accede como administrador o como cliente.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Usuario</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-sky-500" placeholder="admin o cliente" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-sky-500" placeholder="••••••••" />
          </div>
          {error ? <div className="text-sm text-red-400">{error}</div> : null}
          <button type="submit" className="w-full rounded-2xl bg-sky-500 px-4 py-3 font-semibold text-white hover:bg-sky-600">Entrar</button>
        </form>
        <div className="mt-5 text-xs text-slate-400">
          <div>Admin: admin / Admin123!</div>
          <div>Cliente: cliente / Cliente123!</div>
        </div>
      </div>
    </div>
  );
}
