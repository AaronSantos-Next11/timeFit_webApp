import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from 'antd';
import Logo from "./components/sidebar_menu/Logo";
import { MenuList } from './components/sidebar_menu/MenuList';
import LogoutButton from './components/sidebar_menu/LogoutButton';
import CollapseButton from './components/sidebar_menu/CollapseButton';
import AppRoutes from './AppRoutes';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase-config"; // Ajusta la ruta según tu estructura

const { Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Escucha el estado de autenticación real en Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        // Guarda el token en localStorage (opcional)
        user.getIdToken().then((token) => {
          localStorage.setItem("authToken", token);
        });
      } else {
        setIsAuthenticated(false);
        // Limpia los tokens en caso de no haber usuario autenticado
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
      }
    });

    // Limpieza del listener al desmontar el componente
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Elimina los tokens de autenticación al cerrar sesión
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setIsAuthenticated(false);
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
              {/* Rutas protegidas */}
              <AppRoutes 
                isAuthenticated={isAuthenticated}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />
            </Content>
          </Layout>
        </Layout>
      ) : (
        // Si el usuario no está autenticado, muestra únicamente las rutas públicas (como Login)
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