import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from 'antd';
import './LogoutModal.css';

const LogoutModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener la ruta anterior para regresar si el usuario cancela
  const from = location.state?.from || '/home';

  // Función para manejar el cierre de sesión confirmado
  const handleLogout = () => {
    navigate('/logout');
  };

  // Función para cancelar y volver a la página anterior
  const handleCancel = () => {
    navigate(from);
  };

  // Si se accede a esta ruta directamente (recargando página), redirigir a home
  useEffect(() => {
    if (!location.state) {
      navigate('/home');
    }
  }, [location.state, navigate]);

  return (
    <Modal
      open={true}
      onCancel={handleCancel}
      footer={null}
      centered
      className="logout-modal-exact"
      width="100%"
      closable={false}
      maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      destroyOnClose={true}
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