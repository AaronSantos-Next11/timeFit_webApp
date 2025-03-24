import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    HouseFill,
    PersonVcardFill,
    PeopleFill,
    LayoutTextSidebar,
    PersonBoundingBox,
    CashCoin,
    CurrencyExchange,
    ArchiveFill,
    CalendarDateFill,
    JournalBookmarkFill,
    GearFill,
    Tools,
    PersonCircle
} from 'react-bootstrap-icons';

export const MenuList = ({ setCurrentPage, collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.substring(1) || 'home';

    const handleMenuClick = (key) => {
        setCurrentPage(key);
        navigate(`/${key}`);
    };

    const IconWrapper = ({ icon: Icon }) => (
        <Icon size={20} style={{ marginRight: '12px' }} />
    );

    // PropTypes validation for IconWrapper
    IconWrapper.propTypes = {
        icon: PropTypes.elementType.isRequired
    };

    return (
        <div className="menu-bar">
            <Menu 
                mode="inline" 
                defaultSelectedKeys={[currentPath]}
                selectedKeys={[currentPath]}
                onClick={({ key }) => handleMenuClick(key)}
            >
                <Menu.Item key="home" icon={<IconWrapper icon={HouseFill} />}>
                    {!collapsed && "Inicio"}
                </Menu.Item>
                
                <Menu.SubMenu 
                    key="membership_management" 
                    icon={<IconWrapper icon={PersonVcardFill} />} 
                    title={!collapsed && "Gestión de Membresías"}
                >
                    <Menu.Item key="membership_management/users" icon={<IconWrapper icon={PeopleFill} />}>
                        {"Usuarios"}
                    </Menu.Item>
                    <Menu.Item key="membership_management/memberships" icon={<IconWrapper icon={LayoutTextSidebar} />}>
                        {"Membresías y Servicios"}
                    </Menu.Item>
                </Menu.SubMenu>

                <Menu.Item key="collaborators" icon={<IconWrapper icon={PersonBoundingBox} />}>
                    {!collapsed && "Colaboradores"}
                </Menu.Item>

                <Menu.SubMenu 
                    key="sales_management" 
                    icon={<IconWrapper icon={CashCoin} />}
                    title={!collapsed && "Gestión de Ventas"}
                >
                    <Menu.Item key="sales_management/revenue" icon={<IconWrapper icon={CurrencyExchange} />}>
                        {"Ingresos"}
                    </Menu.Item>
                    <Menu.Item key="sales_management/inventorycontrol" icon={<IconWrapper icon={ArchiveFill} />}>
                        {"Control de Inventario"}
                    </Menu.Item>
                </Menu.SubMenu>

                <Menu.Item key="calendar" icon={<IconWrapper icon={CalendarDateFill} />}>
                    {!collapsed && "Calendario"}
                </Menu.Item>

                <Menu.Item key="notes" icon={<IconWrapper icon={JournalBookmarkFill} />}>
                    {!collapsed && "Notas"}
                </Menu.Item>

                <Menu.Item key="settings" icon={<IconWrapper icon={GearFill} />}>
                    {!collapsed && "Configuración"}
                </Menu.Item>

                <Menu.Item key="support_and_help" icon={<IconWrapper icon={Tools} />}>
                    {!collapsed && "Soporte y Ayuda"}
                </Menu.Item>

                <Menu.Item key="user_profile" icon={<IconWrapper icon={PersonCircle} />}>
                    {!collapsed && "Perfil de Usuario"}
                </Menu.Item>
            </Menu>
        </div>
    )
}

// PropTypes validation for MenuList
MenuList.propTypes = {
    setCurrentPage: PropTypes.func.isRequired,
    collapsed: PropTypes.bool.isRequired
};

export default MenuList;