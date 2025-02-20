import { Menu } from 'antd'
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
    const handleMenuClick = (key) => {
        setCurrentPage(key);
    };

    const IconWrapper = ({ icon: Icon }) => (
        <Icon size={16} style={{ marginRight: '12px' }} />  // Fixed margin-right regardless of collapsed state
    );

    return (
        <div className="menu-bar">
            <Menu 
                mode="inline" 
                defaultSelectedKeys={['home']}
                onClick={({ key }) => handleMenuClick(key)}
            >
                <Menu.Item key="home" icon={<IconWrapper icon={HouseFill} />}>
                    {!collapsed && "Inicio"}
                </Menu.Item>
                
                <Menu.SubMenu 
                    key="membership" 
                    icon={<IconWrapper icon={PersonVcardFill} />} 
                    title={!collapsed && "Gestión de Membresías"}
                >
                    <Menu.Item key="users" icon={<IconWrapper icon={PeopleFill} />}>
                        {"Usuarios"}
                    </Menu.Item>
                    <Menu.Item key="memberships" icon={<IconWrapper icon={LayoutTextSidebar} />}>
                        {"Membresías y Servicios"}
                    </Menu.Item>
                </Menu.SubMenu>

                <Menu.Item key="collaborators" icon={<IconWrapper icon={PersonBoundingBox} />}>
                    {!collapsed && "Colaboradores"}
                </Menu.Item>

                <Menu.SubMenu 
                    key="sales" 
                    icon={<IconWrapper icon={CashCoin} />}
                    title={!collapsed && "Gestión de Ventas"}
                >
                    <Menu.Item key="revenue" icon={<IconWrapper icon={CurrencyExchange} />}>
                        {"Ingresos"}
                    </Menu.Item>
                    <Menu.Item key="inventoryControl" icon={<IconWrapper icon={ArchiveFill} />}>
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

                <Menu.Item key="Support_and_help" icon={<IconWrapper icon={Tools} />}>
                    {!collapsed && "Soporte y Ayuda"}
                </Menu.Item>

                <Menu.Item key="User_profile" icon={<IconWrapper icon={PersonCircle} />}>
                    {!collapsed && "Perfil de Usuario"}
                </Menu.Item>
            </Menu>
        </div>
    )
}