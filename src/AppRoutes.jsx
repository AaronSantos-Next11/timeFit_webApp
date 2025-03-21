// AppRoutes.js
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
import Login from './components/log_in/Login'; 

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/membership_management">
        <Route index element={<Navigate to="memberships" replace />} />
        <Route path="memberships" element={<Memberships />} />
        <Route path="users" element={<Users />} />
      </Route>
      <Route path="/sales_management">
        <Route index element={<Navigate to="inventorycontrol" replace />} />
        <Route path="inventorycontrol" element={<InventoryControl />} />
        <Route path="revenue" element={<Revenue />} />
      </Route>
      <Route path="/collaborators" element={<Collaborators />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/support_and_help" element={<SupportAndHelp />} />
      <Route path="/user_profile" element={<UserProfile />} />
      <Route path="/logout" element={<Logout />} /> {/* Ruta para cerrar sesión */}
      <Route path="/login" element={<Login />} /> {/* Ruta para iniciar sesión */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;