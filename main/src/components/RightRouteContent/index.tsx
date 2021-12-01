import React from 'react';
import {Route, Routes} from 'react-router-dom'

import menuConfig, {MenuConfig} from "src/config/menu";
import './index.css'

export default function RightRouteContent() {

  const recursionGenerateRoute = (config: MenuConfig) => {
    if (config.element) {
      return <Route key={config.path} path={config.path}
                    element={config.element}/>
    }
  }

  return (
    <div className="right-content">
      <Routes>
        {menuConfig.map(config => (recursionGenerateRoute(config)))}
      </Routes>
    </div>
  );
};



