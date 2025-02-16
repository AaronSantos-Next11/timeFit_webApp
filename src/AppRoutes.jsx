import { Routes, Route } from 'react-router-dom';
import Home from '../components/home/Home';
import Memberships from '../components/membership_management/memberships_and_services/Memberships';
import Users from '../components/membership_management/users/Users';
import Collaborators from '../components/collaborators/Collaborators';
import Inventory_control from '../components/sales_management/inventory_control/Inventorycontrol';
import Revenue from '../components/sales_management/revenue/Revenue';
import Calendar from '../components/calendar/Calendar';
import Notes from '../components/notes/Notes';
import Settings from '../components/settings/Settings';
import Support_and_help from '../components/support_and_help/Support_and_help';
import User_profile from '../components/user_profile/User_profile';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/memberships" element={<Memberships />} />
      <Route path="/users" element={<Users />} />
      <Route path="/collaborators" element={<Collaborators />} />
      <Route path="/inventorycontrol" element={<Inventory_control />} />
      <Route path="/revenue" element={<Revenue />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/support_and_help" element={<Support_and_help />} />
      <Route path="/user_profile" element={<User_profile />} />
    </Routes>
  );
};

export default AppRoutes;
