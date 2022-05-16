import React from 'react';
import {Route, Routes} from 'react-router-dom'

import menuConfig, {MenuConfig} from "src/config/menu";
import './index.css'

export default function RightRouteContent() {

  const recursionGenerateRoute = (menuConfig: Array<MenuConfig>, parentPath: string) => {
    return menuConfig.map(config => {
      const routePath = parentPath ? parentPath + config.path : config.path

      const inheritParentPath = routePath

      const route = <Route key={config.name} path={inheritParentPath}
                           element={config.element}/>

      if (config.children && config.children.length > 0) {
        return <Route
          key={config.name}>{recursionGenerateRoute(config.children, inheritParentPath)}</Route>
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



