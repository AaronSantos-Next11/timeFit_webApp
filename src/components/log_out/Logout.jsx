// components/log_out/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Limpiar datos de sesión
    localStorage.removeItem('token'); // Elimina el token de autenticación
    localStorage.removeItem('user'); // Elimina otros datos de usuario si es necesario

    // 2. Redirigir al usuario a la página de inicio de sesión
    navigate('/login', { replace: true }); // Usa { replace: true } para evitar que el usuario vuelva atrás
  }, [navigate]);

  return null; // No renderiza nada, ya que es solo para lógica
};

export default Logout;