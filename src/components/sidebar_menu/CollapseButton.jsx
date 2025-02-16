import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const CollapseButton = ({ collapsed, setCollapsed }) => {
    return (
        <div className="collapse-button-container">
            <Button
                type="text"
                onClick={() => setCollapsed(!collapsed)}
                className="collapse-trigger"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            />
        </div>
    );
};

export default CollapseButton;