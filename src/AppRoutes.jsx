import { Routes, Route, Navigate } from 'react-router-dom';
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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirección de la raíz a "/home" */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />

      {/* Rutas anidadas para gestión de membresías */}
      <Route path="/membership_management">
        {/* Ruta índice: al acceder a /membership_management se redirige a /membership_management/memberships */}
        <Route index element={<Navigate to="memberships" replace />} />
        <Route path="memberships" element={<Memberships />} />
        <Route path="users" element={<Users />} />
      </Route>

      {/* Rutas anidadas para gestión de ventas */}
      <Route path="/sales_management">
        {/* Ruta índice: al acceder a /sales_management se redirige a /sales_management/inventorycontrol */}
        <Route index element={<Navigate to="inventorycontrol" replace />} />
        <Route path="inventorycontrol" element={<InventoryControl />} />
        <Route path="revenue" element={<Revenue />} />
      </Route>

      {/* Rutas independientes */}
      <Route path="/collaborators" element={<Collaborators />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/support_and_help" element={<SupportAndHelp />} />
      <Route path="/user_profile" element={<UserProfile />} />
      <Route path="/logout" element={<Logout />} />

      {/* Ruta comodín para redirigir cualquier URL no reconocida a "/home" */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
