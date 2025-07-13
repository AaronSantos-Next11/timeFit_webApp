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
    HeartPulse,
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
  selectedKeys={[currentPath]}
  onClick={({ key }) => handleMenuClick(key)}
  items={[
    {
      key: 'home',
      icon: <HouseFill size={20} />,
      label: !collapsed && 'Inicio',
    },
    isColab && {
      key: 'users',
      icon: <PeopleFill size={20} />,
      label: !collapsed && 'Usuarios',
    },
    {
      key: 'memberships',
      icon: <LayoutTextSidebar size={20} />,
      label: !collapsed && 'Membresías',
    },
    isAdmin && {
      key: 'collaborators',
      icon: <PersonBoundingBox size={20} />,
      label: !collapsed && 'Colaboradores',
    },
    isAdmin && {
      key: 'revenue',
      icon: <CurrencyExchange size={20} />,
      label: !collapsed && 'Ingresos',
    },
    (isAdmin || isColab) && {
      key: 'inventorycontrol',
      icon: <ArchiveFill size={20} />,
      label: !collapsed && 'Control de Inventario',
    },
    {
      key: 'calendar',
      icon: <CalendarDateFill size={20} />,
      label: !collapsed && 'Calendario',
    },
    {
      key: 'notes',
      icon: <JournalBookmarkFill size={20} />,
      label: !collapsed && 'Notas',
    },
    {
      key: 'gimnasio',
      icon: <HeartPulse size={20} />,
      label: !collapsed && 'Gimnasio',
    },
    isAdmin && {
      key: 'support_and_help',
      icon: <Tools size={20} />,
      label: !collapsed && 'Soporte y Ayuda',
    },
    {
      key: 'user_profile',
      icon: <PersonCircle size={20} />,
      label: !collapsed && 'Perfil de Usuario',
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
