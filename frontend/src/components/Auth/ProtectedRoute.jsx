import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { getUserRole, isAuthenticated, logout } from "../../services/authService";
import apiClient from "../../services/api";

export default function ProtectedRoute({ component: Component, allowedRoles = ["admin", "cliente"], ...rest }) {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    let mounted = true;

    const validate = async () => {
      if (!isAuthenticated()) {
        if (mounted) { setValid(false); setChecking(false); }
        return;
      }

      try {
        // Hacer una petición ligera para verificar que el token sigue siendo válido
        await apiClient.get('categorias/');
        if (mounted) { setValid(true); setChecking(false); }
      } catch (err) {
        // Si el backend no responde o el token expiró, limpiar sesión y redirigir
        logout();
        if (mounted) { setValid(false); setChecking(false); }
      }
    };

    validate();

    return () => { mounted = false; };
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-indigo-600 mb-3"></i>
          <p className="text-gray-500">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!valid || !isAuthenticated()) {
          return <Redirect to="/auth/login" />;
        }

        const role = getUserRole();
        if (allowedRoles.includes(role)) {
          return <Component {...props} />;
        }

        return <Redirect to={role === "admin" ? "/dashboard" : "/store"} />;
      }}
    />
  );
}