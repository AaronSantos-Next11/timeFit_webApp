import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
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

  // Verificar la sesión al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true); // Si hay un token, el usuario está autenticado
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true); // Actualiza el estado a "autenticado"
  };

  const handleLogout = () => {
    // Elimina el token de localStorage y sessionStorage al cerrar sesión
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setIsAuthenticated(false); // Actualiza el estado a "no autenticado"
  };

  return (
    <Router>
      {/* Renderiza el Layout solo si el usuario está autenticado */}
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
                  onLogout={handleLogout} // Pasa handleLogout al botón de cerrar sesión
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
              {/* Renderizan las rutas protegidas */}
              <AppRoutes 
                isAuthenticated={isAuthenticated}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />
            </Content>
          </Layout>
        </Layout>
      ) : (
        // Si el usuario no está autenticado, renderiza solo las rutas públicas (login)
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