import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from 'antd';
import './LogoutModal.css';

const LogoutModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from || '/home';

  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/logout', { state: { from: location.pathname } });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const handleCancel = () => {
    navigate(from);
  };

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
      className="logout-modal"
      closable={false}
      maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
      destroyOnClose={true}
    >
      <div className="logout-container">
        <div className="logout-icon">
          <i className="bi bi-shield-exclamation"></i>
        </div>
        
        <h2 className="logout-title">Cerrar Sesión</h2>
        <p className="logout-message">¿Estás seguro que deseas salir de tu cuenta?</p>
        
        <div className="logout-actions">
          <button 
            className="btn-cancel"
            onClick={handleCancel}
            type="button"
          >
            Cancelar
          </button>
          
          <button 
            className="btn-logout"
            onClick={handleLogout}
            type="button"
          >
            <i className="bi bi-box-arrow-right"></i>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;