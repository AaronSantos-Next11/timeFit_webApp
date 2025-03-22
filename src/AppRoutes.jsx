import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react'; // Para manejar el estado de autenticación
import PrivateRoute from './components/PrivateRoute'; // Componente para proteger rutas
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
  // Estado para manejar la autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para manejar el login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Función para manejar el logout
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Routes>
      {/* Ruta raíz: redirige a /login si no está autenticado */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Ruta de login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      {/* Ruta de home (protegida) */}
      <Route
        path="/home"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Home />
          </PrivateRoute>
        }
      />

      {/* Rutas de membership_management (protegidas) */}
      <Route path="/membership_management">
        <Route
          index
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Navigate to="memberships" replace />
            </PrivateRoute>
          }
        />
        <Route
          path="memberships"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Memberships />
            </PrivateRoute>
          }
        />
        <Route
          path="users"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Users />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Rutas de sales_management (protegidas) */}
      <Route path="/sales_management">
        <Route
          index
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Navigate to="inventorycontrol" replace />
            </PrivateRoute>
          }
        />
        <Route
          path="inventorycontrol"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <InventoryControl />
            </PrivateRoute>
          }
        />
        <Route
          path="revenue"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Revenue />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Otras rutas protegidas */}
      <Route
        path="/collaborators"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Collaborators />
          </PrivateRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Calendar />
          </PrivateRoute>
        }
      />
      <Route
        path="/notes"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Notes />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route
        path="/support_and_help"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <SupportAndHelp />
          </PrivateRoute>
        }
      />
      <Route
        path="/user_profile"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <UserProfile />
          </PrivateRoute>
        }
      />

      {/* Ruta de logout */}
      <Route
        path="/logout"
        element={<Logout onLogout={handleLogout} />}
      />

      {/* Ruta comodín: redirige a /home si la ruta no existe */}
      <Route
        path="*"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Navigate to="/home" replace />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;