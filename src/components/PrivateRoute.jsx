import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, isAuthenticated }) => {
  // Si el usuario está autenticado, renderiza el componente hijo (la ruta protegida)
  // Si no, redirige al usuario a /login
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;