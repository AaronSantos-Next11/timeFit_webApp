import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './LogoutButton.css';

const LogoutButton = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    // Navegar a la ruta de confirmación de logout, 
    // pasando la ubicación actual como state para poder volver
    navigate('/logout-confirm', { state: { from: location.pathname } });
  };

  return (
    <Button
      icon={<LogoutOutlined />}
      className={`logout-button ${collapsed ? 'collapsed' : ''}`}
      onClick={handleLogoutClick}
      style={{
        width: '100%',
        textAlign: 'left',
        color: '#ffffff',
        border: 'none',
        padding: '10px 24px',
      }}
    >
      {!collapsed && <span className="button-text">Cerrar Sesión</span>}
    </Button>
  );
};

LogoutButton.propTypes = {
  collapsed: PropTypes.bool.isRequired,
};

export default LogoutButton;