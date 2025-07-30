// src/App.jsx
import { useState, useEffect } from 'react';
import { HashRouter as Router, useLocation } from 'react-router-dom';
import { Layout } from 'antd';

import Logo from "./components/sidebar_menu/Logo";
import { MenuList } from './components/sidebar_menu/MenuList';
import LogoutButton from './components/sidebar_menu/LogoutButton';
import CollapseButton from './components/sidebar_menu/CollapseButton';
import AppRoutes from './AppRoutes';

import { getStoredToken, isTokenExpired, clearSession } from './utils/token';

const { Sider, Content } = Layout;

// Componente interno para manejar la lógica del Router
function AppContent() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    const path = location.pathname.substring(1) || 'home';
    return path;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // CORRECCIÓN: Agregar estado de loading para evitar redirecciones prematuras
  const [isLoading, setIsLoading] = useState(true);

  // Al iniciar la app, revisa token y expiración
  useEffect(() => {
    const checkAuth = () => {
      const token = getStoredToken();
      if (token && !isTokenExpired(token)) {
        setIsAuthenticated(true);
      } else {
        clearSession();
        setIsAuthenticated(false);
      }
      // CORRECCIÓN: Marcar como completada la verificación de autenticación
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Actualizar currentPage cuando cambie la URL
  useEffect(() => {
    const path = location.pathname.substring(1) || 'home';
    setCurrentPage(path);
  }, [location.pathname]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    clearSession();
  };

  // CORRECCIÓN: Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#272829',
        color: '#ffffff'
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Layout>
          <Sider
            collapsible
            trigger={null}
            theme="dark"
            className="sidebar"
            collapsed={collapsed}
            width={260}
            style={{ overflow: 'hidden' }}
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
                collapsed={collapsed}
              />
            </Content>
          </Layout>
        </Layout>
      ) : (
        <AppRoutes
          collapsed={collapsed}
          isAuthenticated={isAuthenticated}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}