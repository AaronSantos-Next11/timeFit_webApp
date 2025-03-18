import { useState } from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import Logo from "./components/sidebar_menu/Logo";
import { MenuList } from './components/sidebar_menu/MenuList';
import LogoutButton from './components/sidebar_menu/LogoutButton';
import CollapseButton from './components/sidebar_menu/CollapseButton';
import AppRoutes from './AppRoutes';

const { Sider, Content } = Layout;

export default function App() {
    const [collapsed, setCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');

    return (
        <Router>
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
                        backgroundColor: '#272829' // Dark background
                    }}
                >
                    <Content 
                        style={{ 
                            margin: '24px 16px', 
                            padding: 24, 
                            minHeight: 280,
                            color: '#ffffff', // White text
                            backgroundColor: '#272829' // Dark background
                        }}
                    >
                        <AppRoutes />
                    </Content>
                </Layout>
            </Layout>
        </Router>
    );
}