import React from 'react';
import {Menu} from 'antd'
import {Link} from "react-router-dom";

import menuConfig, {MenuConfig} from "src/config/menu";
import './index.css'

const {SubMenu} = Menu;

export default function LeftMenu() {

  const defaultOpenKeys = ['0']

  const recursionGenerateMenu = (menuConfig: Array<MenuConfig>, parentPath: string) => {
    return menuConfig.map(config => {
      const linkPath = parentPath ? parentPath + config.path : config.path

      const element = <Menu.Item key={config.path}>
        <Link to={linkPath}>{config.name}</Link>
      </Menu.Item>

      if (config.children && config.children.length > 0) {
        return <SubMenu key={config.path} title={config.name}>
          {recursionGenerateMenu(config.children, config.path)}
        </SubMenu>
      }

      return element
    })
  }

  return (
    <div className="left-panel">
      <Menu
        defaultOpenKeys={defaultOpenKeys}
        mode="inline"
      >
        {recursionGenerateMenu(menuConfig, '')}
      </Menu>
    </div>
  );
};
