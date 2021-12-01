import React from 'react';
import {Menu} from 'antd'
import {useNavigate} from 'react-router-dom';

const {SubMenu} = Menu;

import './index.css'

interface SelectInfo {
  key: string
};

export default function LeftMenu() {
  const navigate = useNavigate()

  const defaultOpenKeys = ['0']

  const onSelect = ({key}: SelectInfo) => {
    navigate(key, {replace: true})
  }


  return (
    <div className="left-panel">
      <Menu
        defaultOpenKeys={defaultOpenKeys}
        mode="inline"
        onSelect={onSelect}
      >
        <Menu.Item key="/">home page</Menu.Item>
        <SubMenu key="fundamentals" title="fundamentals">
          <Menu.Item key="/fundamentals/triangles">triangles</Menu.Item>
        </SubMenu>

        <SubMenu key="advanced" title="advanced">
        </SubMenu>
      </Menu>
    </div>
  );
};
