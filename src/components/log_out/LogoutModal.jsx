import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from 'antd';
import './LogoutModal.css';

const LogoutModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  
  // Obtain the previous route to return if the user cancels
  const from = location.state?.from || '/home';

  // Function to handle confirmed logout
  const handleLogout = () => {
    try {
      // Ensure logout actions are performed
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('user');

      // Navigate to logout route
      navigate('/logout', { 
        state: { from: location.pathname } 
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback navigation if something goes wrong
      navigate('/login');
    }
  };

  // Function to cancel and return to the previous page
  const handleCancel = () => {
    navigate(from);
  };

  // Debugging: Log location state
  useEffect(() => {
    console.log('Location state:', location.state);
  }, [location.state]);

  // If accessed directly (reloading page), redirect to home
  useEffect(() => {
    if (!location.state) {
      navigate('/home');
    }
  }, [location.state, navigate]);

  // Ensure modal is always visible
  useEffect(() => {
    const handleResize = () => {
      setIsVisible(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fallback render if something goes wrong
  if (!isVisible) {
    return (
      <div className="logout-content">
        <h1 className="logout-heading">Error al cargar el modal de cierre de sesión</h1>
        <button onClick={() => setIsVisible(true)}>Reintentar</button>
      </div>
    );
  }

  return (
    <Modal
      open={true}
      onCancel={handleCancel}
      footer={null}
      centered
      className="logout-modal-exact"
      width="100%"
      closable={false}
      maskStyle={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.85)', 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      destroyOnClose={true}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        margin: 0, 
        width: '100vw', 
        height: '100vh' 
      }}
    >
      <div className="logout-content">
        <h1 className="logout-heading">¿Estás seguro de que deseas cerrar sesión?</h1>
        
        <div className="logout-buttons-container">
          <button 
            className="exit-button"
            onClick={handleLogout}
            type="button"
          >
            <i className="bi bi-box-arrow-right"></i>
            Salir de la aplicación
          </button>
          
          <button 
            className="return-button"
            onClick={handleCancel}
            type="button"
          >
            <i className="bi bi-arrow-return-left"></i>
            Regresar a la aplicación
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;