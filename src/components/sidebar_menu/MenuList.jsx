import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    HouseFill,
    PeopleFill,
    LayoutTextSidebar,
    PersonBoundingBox,
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

    IconWrapper.propTypes = {
        icon: PropTypes.elementType.isRequired
    };

    let roleName = '';
    try {
        const adminDataString = localStorage.getItem('admin') || sessionStorage.getItem('admin');
        const admin = adminDataString ? JSON.parse(adminDataString) : null;
        roleName = admin?.role?.role_name || '';
    } catch {
        roleName = '';
    }

    const isAdmin = roleName === 'Administrador';
    const isColab = roleName === 'Colaborador';

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

                {isColab && (
                    <Menu.Item key="users" icon={<IconWrapper icon={PeopleFill} />}>
                        {!collapsed && "Usuarios"}
                    </Menu.Item>
                )}

                <Menu.Item key="memberships" icon={<IconWrapper icon={LayoutTextSidebar} />}>
                    {!collapsed && "Membresías"}
                </Menu.Item>

                {isAdmin && (
                    <Menu.Item key="collaborators" icon={<IconWrapper icon={PersonBoundingBox} />}>
                        {!collapsed && "Colaboradores"}
                    </Menu.Item>
                )}

                {isAdmin && (
                    <Menu.Item key="revenue" icon={<IconWrapper icon={CurrencyExchange} />}>
                        {!collapsed && "Ingresos"}
                    </Menu.Item>
                )}

                {(isAdmin || isColab) && (
                    <Menu.Item key="inventorycontrol" icon={<IconWrapper icon={ArchiveFill} />}>
                        {!collapsed && "Control de Inventario"}
                    </Menu.Item>
                )}

                <Menu.Item key="calendar" icon={<IconWrapper icon={CalendarDateFill} />}>
                    {!collapsed && "Calendario"}
                </Menu.Item>

                <Menu.Item key="notes" icon={<IconWrapper icon={JournalBookmarkFill} />}>
                    {!collapsed && "Notas"}
                </Menu.Item>

                <Menu.Item key="gimnasio" icon={<IconWrapper icon={GearFill} />}>
                    {!collapsed && "Gimnasio"}
                </Menu.Item>

                {isAdmin && (
                    <Menu.Item key="support_and_help" icon={<IconWrapper icon={Tools} />}>
                        {!collapsed && "Soporte y Ayuda"}
                    </Menu.Item>
                )}

                <Menu.Item key="user_profile" icon={<IconWrapper icon={PersonCircle} />}>
                    {!collapsed && "Perfil de Usuario"}
                </Menu.Item>
            </Menu>
        </div>
    );
};

MenuList.propTypes = {
    setCurrentPage: PropTypes.func.isRequired,
    collapsed: PropTypes.bool.isRequired
};

export default MenuList;
