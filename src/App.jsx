import { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Layout } from 'antd';
import Logo from "./components/sidebar_menu/Logo";
import { MenuList } from './components/sidebar_menu/MenuList';
import LogoutButton from './components/sidebar_menu/LogoutButton';
import CollapseButton from './components/sidebar_menu/CollapseButton';
import AppRoutes from './AppRoutes';

const { Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Al iniciar la app, revisa si hay sesión activa
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Limpia todo al cerrar sesión
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("admin");
  };

  return (
    <Router>
      {isAuthenticated ? (
        <Layout>
          <Sider
            collapsible
            trigger={null}
            theme="dark"
            className='sidebar'
            collapsed={collapsed}
            width={260}
            style={{
              overflow: 'hidden'
            }}
          >
            <div className="header-container">
              <Logo collapsed={collapsed} />
              <CollapseButton collapsed={collapsed} setCollapsed={setCollapsed} />
            </div>
            <div className="menu-container">
              <MenuList 
                collapsed={collapsed}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
              <div className="logout-button-container">
                <LogoutButton 
                  collapsed={collapsed} 
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </div>
          </Sider>

          <Layout 
            style={{ 
              marginLeft: collapsed ? 80 : 260, 
              transition: 'margin-left 0.2s',
              minHeight: '100vh',
              backgroundColor: '#272829' 
            }}
          >
            <Content 
              style={{ 
                margin: '24px 16px', 
                padding: 24, 
                minHeight: 280,
                color: '#ffffff', 
                backgroundColor: '#272829' 
              }}
            >
              <AppRoutes 
                isAuthenticated={isAuthenticated}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />
            </Content>
          </Layout>
        </Layout>
      ) : (
        <AppRoutes 
          isAuthenticated={isAuthenticated}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      )}
    </Router>
  );
};

export default App;