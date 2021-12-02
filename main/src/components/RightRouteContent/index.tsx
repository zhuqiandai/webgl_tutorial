import React from 'react';
import {Route, Routes} from 'react-router-dom'

import menuConfig, {MenuConfig} from "src/config/menu";
import './index.css'

export default function RightRouteContent() {

  const recursionGenerateRoute = (menuConfig: Array<MenuConfig>, parentPath: string) => {
    return menuConfig.map(config => {
      const routePath = parentPath ? parentPath + config.path : config.path

      const route = <Route key={config.path} path={routePath}
                           element={config.element}/>

      if (config.children && config.children.length > 0) {
        return <Route
          key={config.path}>{recursionGenerateRoute(config.children, config.path)}</Route>
      }

      return route
    })
  }

  return (
    <div className="right-content">
      <Routes>
        {recursionGenerateRoute(menuConfig, '')}
      </Routes>
    </div>
  );
};



