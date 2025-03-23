import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Ejecutar acciones de logout en el efecto
    
    // 1. Limpiar datos de sesión
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // 2. Actualizar el estado de autenticación en la aplicación
    if (onLogout) {
      onLogout();
    }

    // 3. Redirigir al usuario a la página de inicio de sesión
    navigate('/login', { replace: true });
  }, [navigate, onLogout]);

  // Este componente no renderiza nada visible
  return null;
};

Logout.propTypes = {
  onLogout: PropTypes.func,
};

export default Logout;