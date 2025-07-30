import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

import Home from './components/home/Home';
import Memberships from './components/memberships/Memberships';
import Users from './components/clients/Users';
import Collaborators from './components/collaborators/Collaborators';
import InventoryControl from './components/inventory_control/Inventorycontrol';
import Revenue from './components/revenue/Revenue';
import Calendar from './components/calendar/Calendar';
import Notes from './components/notes/Notes';
import Gym from './components/gimnasio/Gym';
import UserProfile from './components/user_profile/User_profile';
import Logout from './components/log_out/Logout';
import Login from './components/log_in/Login';
import Signup from './components/sign_up/Signup'; 
import LogoutModal from './components/log_out/LogoutModal';

const AppRoutes = ({ isAuthenticated, onLogin, onLogout, collapsed }) => {
  const location = useLocation();
  console.log("Ruta actual:", location.pathname);

  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    // CORRECCIÓN: Solo actualizar el rol si el usuario está autenticado
    if (isAuthenticated) {
      let user = null;
      try {
        const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
        user = raw ? JSON.parse(raw) : null;
      } catch {
        user = null;
      }
      setRoleName(user?.role?.role_name || "");
    } else {
      // Si no está autenticado, limpiar el rol
      setRoleName("");
    }
  }, [isAuthenticated]);

  const isAdmin = roleName === "Administrador";
  const isColab = roleName === "Colaborador";

  // Función para determinar la ruta por defecto según el rol
  const getDefaultRoute = () => {
    if (isAdmin) return "/home";
    if (isColab) return "/users";
    return "/login";
  };

  return (
    <Routes>
      {/* Ruta raíz - solo redirige si está en "/" exactamente */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Navigate to="/login" replace />
      } />
      
      {/* Rutas públicas - sin redirecciones automáticas */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Login onLogin={onLogin} />
      } />
      
      <Route path="/sign_up" element={
        isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Signup onSignUp={onLogin} />
      } />
      
      <Route path="/logout-confirm" element={
        isAuthenticated ? <LogoutModal /> : <Navigate to="/login" replace />
      } />
      
      <Route path="/logout" element={<Logout onLogout={onLogout} />} />

      {/* CORRECCIÓN: Rutas protegidas - verificar autenticación primero */}
      <Route path="/*" element={
        isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
      }>
        {/* Rutas solo para ADMINISTRADOR */}
        {isAdmin && (
          <>
            <Route path="home" element={<Home collapsed={collapsed} />} />
            <Route path="collaborators" element={<Collaborators collapsed={collapsed} />} />
            <Route path="revenue" element={<Revenue collapsed={collapsed} />} />
          </>
        )}

        {/* Rutas comunes para ADMINISTRADOR y COLABORADOR */}
        {(isAdmin || isColab) && (
          <>
            <Route path="users" element={<Users collapsed={collapsed} />} />
            <Route path="inventorycontrol" element={<InventoryControl collapsed={collapsed} />} />
          </>
        )}

        {/* Rutas comunes para todos los usuarios autenticados */}
        <Route path="memberships" element={<Memberships collapsed={collapsed} />} />
        <Route path="calendar" element={<Calendar collapsed={collapsed} />} />
        <Route path="notes" element={<Notes collapsed={collapsed} />} />
        <Route path="gimnasio" element={<Gym collapsed={collapsed} />} />
        <Route path="user_profile" element={<UserProfile collapsed={collapsed} />} />

        {/* CORRECCIÓN: Wildcard mejorado - solo redirige rutas que realmente no existen */}
        <Route path="*" element={
          <Navigate to={getDefaultRoute()} replace />
        } />
      </Route>
    </Routes>
  );
};

AppRoutes.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  collapsed: PropTypes.bool
};

export default AppRoutes;