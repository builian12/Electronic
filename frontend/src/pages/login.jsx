import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      history.push("/dashboard");
    } catch (err) {
      setError("El Usuario o contraseña incorrectos");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-gray-900 text-white p-8 rounded-lg shadow-2xl border border-gray-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-green-400">
              <i className="fas fa-music mr-2"></i> Iniciar sesión
            </h1>
            <p className="text-sm text-green-400 font-medium">Ingrese sus credenciales para continuar</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label
                className="block text-sm font-bold mb-2 text-green-400"
                htmlFor="username"
              >
                Usuario o correo electronico
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 text-green-400 px-4 py-3 rounded-md shadow focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-colors placeholder-green-700"
                placeholder="Nombre de usuario"
              />
            </div>

            <div>
              <label
                className="block text-sm font-bold mb-2 text-green-400"
                htmlFor="password"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 text-green-400 px-4 py-3 rounded-md shadow focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-colors placeholder-green-700"
                placeholder="Contraseña"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-400 text-gray-900 font-bold uppercase tracking-wider py-4 rounded-full shadow hover:shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? "Iniciando..." : "Iniciar Sesión"}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center border-t border-gray-800 pt-6">
            <p className="text-green-500 text-sm font-medium">
              ¿No tienes una cuenta? <Link to="/auth/register" className="text-green-400 hover:text-green-300 underline transition-colors">Regístrate</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
