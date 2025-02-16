import { useState } from 'react';
import { Layout, theme } from 'antd';
import Logo from "./components/sidebar_menu/Logo";
import { MenuList } from './components/sidebar_menu/MenuList';
import LogoutButton from './components/sidebar_menu/LogoutButton';
import CollapseButton from './components/sidebar_menu/CollapseButton';

// Importa todos los componentes incluyendo Logout
import Home from './components/home/Home';
import Memberships from './components/membership_management/memberships_and_services/Memberships';
import Users from './components/membership_management/users/Users';
import Collaborators from './components/collaborators/Collaborators';
import InventoryControl from './components/sales_management/inventory_control/Inventorycontrol';
import Revenue from './components/sales_management/revenue/Revenue';
import Calendar from './components/calendar/Calendar';
import Notes from './components/notes/Notes';
import Settings from './components/settings/Settings';
import Support_and_help from './components/support_and_help/Support_and_help';
import User_profile from './components/user_profile/User_profile';
import Logout from './components/log_out/Logout';

const { Sider, Content } = Layout;

export default function App() {
    const [collapsed, setCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');

    const { token: { colorBgContainer } } = theme.useToken();

    const renderContent = () => {
        switch(currentPage) {
            case 'home':
                return <Home />;
            case 'memberships':
                return <Memberships />;
            case 'users':
                return <Users />;
            case 'collaborators':
                return <Collaborators />;
            case 'inventoryControl':
                return <InventoryControl />;
            case 'revenue':
                return <Revenue />;
            case 'calendar':
                return <Calendar />;
            case 'notes':
                return <Notes />;
            case 'settings':
                return <Settings />;
            case 'Support_and_help':
                return <Support_and_help />;
            case 'User_profile':
                return <User_profile />;
            case 'Logout':
                return <Logout />;
            default:
                return <Home />;
        }
    };

    return (
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
                        setCurrentPage={setCurrentPage}
                        collapsed={collapsed}  // Añade esta línea
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
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
}