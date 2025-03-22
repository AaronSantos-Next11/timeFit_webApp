import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Limpiar datos de sesión
    localStorage.removeItem('token'); // Elimina el token de autenticación
    localStorage.removeItem('user'); // Elimina otros datos de usuario si es necesario

    // 2. Actualizar el estado de autenticación
    if (onLogout) {
      onLogout();
    }

    // 3. Redirigir al usuario a la página de inicio de sesión
    navigate('/login', { replace: true });
  }, [navigate, onLogout]);

  return null; 
};

export default Logout;