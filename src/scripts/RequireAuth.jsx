// src/scripts/RequireAuth.jsx
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { getStoredToken, isTokenExpired, clearSession } from '../utils/token';

export default function RequireAuth() {
  const location = useLocation();
  const token = getStoredToken();

  // Si no hay token o expiró, limpia y redirige a login
  if (!token || isTokenExpired(token)) {
    clearSession();
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Token válido: renderiza las rutas hijas
  return <Outlet />;
}
