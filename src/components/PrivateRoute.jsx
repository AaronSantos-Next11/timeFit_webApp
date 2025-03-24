import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, isAuthenticated }) => {
  // Si el usuario está autenticado, renderiza el componente hijo (la ruta protegida)
  // Si no, redirige al usuario a /login
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Añadir validación de PropTypes
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

export default PrivateRoute;