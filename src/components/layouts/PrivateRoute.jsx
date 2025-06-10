import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AppContext";

export default function PrivateRoute({ requiredRole }) {
  const { role } = useAuth();

  if (!role) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }
  if (role !== requiredRole) {
    // Logged in but wrong portal
    return <Navigate to="/login" replace />;
  }
  // Authorized
  return <Outlet />;
}
