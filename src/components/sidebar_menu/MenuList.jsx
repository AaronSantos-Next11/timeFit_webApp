import React, { useEffect } from 'react';
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
    HeartPulse,
    PersonCircle
} from 'react-bootstrap-icons';

export const MenuList = ({ setCurrentPage, collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.substring(1) || 'home';

    // CORRECCIÓN: Sincronizar currentPage con la URL actual al montar o cambiar la ruta
    useEffect(() => {
        setCurrentPage(currentPath);
    }, [currentPath, setCurrentPage]);

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
        const adminDataString = localStorage.getItem('user') || sessionStorage.getItem('user');
        const admin = adminDataString ? JSON.parse(adminDataString) : null;
        roleName = admin?.role?.role_name || '';
    } catch {
        roleName = '';
    }

    const isAdmin = roleName === 'Administrador';
    const isColab = roleName === 'Colaborador';

    // CORRECCIÓN: Usar currentPath directamente en lugar de depender del estado
    return (
        <div className="menu-bar">
            <Menu
                mode="inline"
                selectedKeys={[currentPath]} // Usar currentPath directamente
                onClick={({ key }) => handleMenuClick(key)}
                getPopupContainer={() => document.body}
                style={{
                    '--ant-color-bg-elevated': '#61677A',
                    '--ant-color-text': '#ffffff',
                }}
                items={[
                    isAdmin && {
                        key: 'home',
                        icon: <HouseFill size={20} />,
                        label: !collapsed && 'Inicio',
                        title: collapsed ? 'Inicio' : undefined,
                    },
                    (isAdmin || isColab) && {
                        key: 'users',
                        icon: <PeopleFill size={20} />,
                        label: !collapsed && 'Clientes',
                        title: collapsed ? 'Clientes' : undefined,
                    },
                    {
                        key: 'memberships',
                        icon: <LayoutTextSidebar size={20} />,
                        label: !collapsed && 'Membresías',
                        title: collapsed ? 'Membresías' : undefined,
                    },
                    isAdmin && {
                        key: 'collaborators',
                        icon: <PersonBoundingBox size={20} />,
                        label: !collapsed && 'Colaboradores',
                        title: collapsed ? 'Colaboradores' : undefined,
                    },
                    isAdmin && {
                        key: 'revenue',
                        icon: <CurrencyExchange size={20} />,
                        label: !collapsed && 'Ingresos',
                        title: collapsed ? 'Ingresos' : undefined,
                    },
                    (isAdmin || isColab) && {
                        key: 'inventorycontrol',
                        icon: <ArchiveFill size={20} />,
                        label: !collapsed && 'Control de Inventario',
                        title: collapsed ? 'Control de Inventario' : undefined,
                    },
                    {
                        key: 'calendar',
                        icon: <CalendarDateFill size={20} />,
                        label: !collapsed && 'Calendario',
                        title: collapsed ? 'Calendario' : undefined,
                    },
                    {
                        key: 'notes',
                        icon: <JournalBookmarkFill size={20} />,
                        label: !collapsed && 'Notas',
                        title: collapsed ? 'Notas' : undefined,
                    },
                    {
                        key: 'gimnasio',
                        icon: <HeartPulse size={20} />,
                        label: !collapsed && 'Gimnasio',
                        title: collapsed ? 'Gimnasio' : undefined,
                    },
                    {
                        key: 'user_profile',
                        icon: <PersonCircle size={20} />,
                        label: !collapsed && 'Perfil de Usuario',
                        title: collapsed ? 'Perfil de Usuario' : undefined,
                    },
                ].filter(Boolean)}
            />
        </div>
    );
};

MenuList.propTypes = {
    setCurrentPage: PropTypes.func.isRequired,
    collapsed: PropTypes.bool.isRequired
};

export default MenuList;