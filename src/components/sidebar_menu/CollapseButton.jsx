import React from 'react';
import PropTypes from 'prop-types';
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

// PropTypes validation
CollapseButton.propTypes = {
    collapsed: PropTypes.bool.isRequired,
    setCollapsed: PropTypes.func.isRequired
};

export default CollapseButton;