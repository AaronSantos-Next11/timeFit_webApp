import PropTypes from 'prop-types'; // Importar PropTypes
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
import CrearMembresia from './components/membership_management/memberships_and_services/CrearMembresia';
import RegistrarServicio from './components/membership_management/memberships_and_services/RegistrarServicio';

const AppRoutes = ({ isAuthenticated, onLogin, onLogout }) => {
  return (
    <Routes>
      {/* Ruta raíz: redirige a /login si no está autenticado */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Ruta de login (fuera del layout de la aplicación) */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace /> // Redirige a /home si ya está autenticado
          ) : (
            <Login onLogin={onLogin} /> // Muestra el Login si no está autenticado
          )
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
            <Outlet /> // Se renderizarán las rutas protegidas
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
          <Route path="registrarservicio" element={<RegistrarServicio />} />
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
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
};

// Validación de PropTypes
AppRoutes.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired, // isAuthenticated es un booleano requerido
  onLogin: PropTypes.func.isRequired, // onLogin es una función requerida
  onLogout: PropTypes.func.isRequired, // onLogout es una función requerida
};

export default AppRoutes;