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
import SupportAndHelp from './components/support_and_help/Support_and_help';
import UserProfile from './components/user_profile/User_profile';
import Logout from './components/log_out/Logout';
import Login from './components/log_in/Login';
import Signup from './components/sign_up/Signup'; 
import LogoutModal from './components/log_out/LogoutModal';

const AppRoutes = ({ isAuthenticated, onLogin, onLogout }) => {
  const location = useLocation();
  console.log("Ruta actual:", location.pathname);

  const [roleName, setRoleName] = useState("");

  // Actualiza el rol cuando cambia isAuthenticated o cuando cambia localStorage "user"
  useEffect(() => {
    let user = null;
    try {
      const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
      user = raw ? JSON.parse(raw) : null;
    } catch {
      user = null;
    }
    setRoleName(user?.role?.role_name || "");
  }, [isAuthenticated]); // Se vuelve a ejecutar cada vez que isAuthenticated cambie

  const isAdmin = roleName === "Administrador";
  const isColab = roleName === "Colaborador";

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
      } />
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/home" replace /> : <Login onLogin={onLogin} />
      } />
      <Route path="/sign_up" element={
        isAuthenticated ? <Navigate to="/home" replace /> : <Signup onSignUp={onLogin} />
      } />
      <Route path="/logout-confirm" element={
        isAuthenticated ? <LogoutModal /> : <Navigate to="/login" replace />
      } />
      <Route path="/logout" element={<Logout onLogout={onLogout} />} />

      {/* Rutas protegidas */}
      <Route path="/*" element={
        isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
      }>
        {/* Rutas comunes */}
        <Route path="home" element={<Home />} />
        <Route path="users" element={<Users />} />
        <Route path="memberships" element={<Memberships />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="notes" element={<Notes />} />
        <Route path="gimnasio" element={<Gym />} />
        <Route path="user_profile" element={<UserProfile />} />

        {/* Rutas ADMINISTRADOR */}
        {isAdmin && (
          <>
            <Route path="collaborators" element={<Collaborators />} />
            <Route path="inventorycontrol" element={<InventoryControl />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="support_and_help" element={<SupportAndHelp />} />
          </>
        )}

        {/* Rutas COLABORADOR */}
        {isColab && !isAdmin && (
          <>
            <Route path="inventorycontrol" element={<InventoryControl />} />
          </>
        )}

        {/* Ruta comodín */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
};

AppRoutes.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default AppRoutes;
