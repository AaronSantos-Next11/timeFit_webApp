import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

const LogoutButton = ({ collapsed, setCurrentPage }) => {
  const handleLogout = () => {
    setCurrentPage('Logout');
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