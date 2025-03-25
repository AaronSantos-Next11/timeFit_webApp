import React from 'react';
import PropTypes from 'prop-types';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './components/home/Home';
import Memberships from './components/membership_management/memberships_and_services/Memberships';
import Users from './components/membership_management/users/Users';
import Collaborators from './components/collaborators/Collaborators';
import InventoryControl from './components/sales_management/inventory_control/Inventorycontrol';
import Revenue from './components/sales_management/revenue/Revenue';
import Calendar from './components/calendar/Calendar';
import Notes from './components/notes/Notes';
import Settings from './components/settings/Settings';
import SupportAndHelp from './components/support_and_help/Support_and_help';
import UserProfile from './components/user_profile/User_profile';
import Logout from './components/log_out/Logout';
import Login from './components/log_in/Login';
import Signup from './components/sign_up/Signup'; 
import CrearMembresia from './components/membership_management/memberships_and_services/CrearMembresia';
import RegistrarServicio from './components/membership_management/memberships_and_services/RegistrarServicio';
import LogoutModal from './components/log_out/LogoutModal';
import ModificarMembresia from './components/membership_management/memberships_and_services/ModificarMembresia';
import ModificarServicio from './components/membership_management/memberships_and_services/ModificarServicio';

const AppRoutes = ({ isAuthenticated, onLogin, onLogout }) => {
  return (
    <Routes>
      {/* Ruta raíz: redirige a /login por defecto */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Ruta de login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <Login onLogin={onLogin} />
          )
        }
      />
      
      {/*ruta de signup */}
      <Route
        path="/sign_up"
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <Signup onSignUp={onLogin} /> // Pass onLogin as onSignUp
          )
        }
      />

      {/* Ruta de confirmación de logout */}
      <Route
        path="/logout-confirm"
        element={
          isAuthenticated ? <LogoutModal /> : <Navigate to="/login" replace />
        }
      />

      {/* Ruta de logout */}
      <Route
        path="/logout"
        element={<Logout onLogout={onLogout} />}
      />

      {/* Rutas protegidas */}
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <Outlet />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="home" element={<Home />} />
        <Route path="membership_management">
          <Route index element={<Navigate to="memberships" replace />} />
          <Route path="memberships" element={<Memberships />} />
          <Route path="crearmembresia" element={<CrearMembresia />} />
          <Route path="editarmembresia" element={<ModificarMembresia />} />
          <Route path="registrarservicio" element={<RegistrarServicio />} />
          <Route path="editarservicio" element={<ModificarServicio />} />
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="sales_management">
          <Route index element={<Navigate to="inventorycontrol" replace />} />
          <Route path="inventorycontrol" element={<InventoryControl />} />
          <Route path="revenue" element={<Revenue />} />
        </Route>
        <Route path="collaborators" element={<Collaborators />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="notes" element={<Notes />} />
        <Route path="settings" element={<Settings />} />
        <Route path="support_and_help" element={<SupportAndHelp />} />
        <Route path="user_profile" element={<UserProfile />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
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