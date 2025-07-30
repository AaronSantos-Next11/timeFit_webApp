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
  const [roleLoaded, setRoleLoaded] = useState(false);

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
      setRoleLoaded(true);
    } else {
      // Si no está autenticado, limpiar el rol
      setRoleName("");
      setRoleLoaded(false);
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

  // CORRECCIÓN: No renderizar rutas protegidas hasta que el rol esté cargado
  if (isAuthenticated && !roleLoaded) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: '#ffffff'
      }}>
        <div>Cargando perfil...</div>
      </div>
    );
  }

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

      {/* CORRECCIÓN: Rutas protegidas - crear todas las rutas sin condiciones de rol */}
      <Route path="/*" element={
        isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
      }>
        {/* Rutas solo para ADMINISTRADOR */}
        <Route path="home" element={
          isAdmin ? <Home collapsed={collapsed} /> : <Navigate to={getDefaultRoute()} replace />
        } />
        <Route path="collaborators" element={
          isAdmin ? <Collaborators collapsed={collapsed} /> : <Navigate to={getDefaultRoute()} replace />
        } />
        <Route path="revenue" element={
          isAdmin ? <Revenue collapsed={collapsed} /> : <Navigate to={getDefaultRoute()} replace />
        } />

        {/* Rutas comunes para ADMINISTRADOR y COLABORADOR */}
        <Route path="users" element={
          (isAdmin || isColab) ? <Users collapsed={collapsed} /> : <Navigate to={getDefaultRoute()} replace />
        } />
        <Route path="inventorycontrol" element={
          (isAdmin || isColab) ? <InventoryControl collapsed={collapsed} /> : <Navigate to={getDefaultRoute()} replace />
        } />

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