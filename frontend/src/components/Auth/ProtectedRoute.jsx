import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getUserRole, isAuthenticated } from "../../services/authService";

export default function ProtectedRoute({ component: Component, allowedRoles = ["admin", "cliente"], ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated()) {
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
