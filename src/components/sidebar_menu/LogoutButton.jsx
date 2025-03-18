import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ collapsed, setCurrentPage }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentPage('logout');
    navigate('/logout');
  };

  return (
    <Button
      icon={<LogoutOutlined />}
      className={`logout-button ${collapsed ? 'collapsed' : ''}`}
      onClick={handleLogout}
    >
      <span className="button-text">Cerrar Sesión</span>
    </Button>
  );
};

export default LogoutButton;