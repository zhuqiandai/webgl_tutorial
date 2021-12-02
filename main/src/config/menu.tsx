import React, {ReactElement} from "react";
import HomePage from "src/pages";
import ClockElement from "src/pages/Base/Clock";
import CoordinateSpace from "src/pages/Base/CoordinateSpace";


export interface MenuConfig {
  path: string,
  name: string,
  element?: ReactElement,
  children?: Array<MenuConfig>
}

const menuConfig: Array<MenuConfig> = [
  {
    path: '/',
    name: 'homepage',
    element: <HomePage/>
  },
  {
    path: '/base',
    name: 'base',
    children: [
      {
        path: '/coordinateSpace',
        name: 'coordinateSpace',
        element: <CoordinateSpace />
      },
      {
        path: '/clockElement',
        name: 'clockElement',
        element: <ClockElement/>
      },
    ]
  },
  {
    path: '/advanced',
    name: 'Advanced',
    children: []
  }
]

export default menuConfig
