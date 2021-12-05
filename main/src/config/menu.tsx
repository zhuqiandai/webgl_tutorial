import React, {ReactElement} from "react";
import HomePage from "src/pages";
import CircleElement from "src/pages/Base/CircleElement";
import CoordinateSpace from "src/pages/Base/CoordinateSpace";
import RotateTransform from "src/pages/Transform/Rotate";
import LightPage from "src/pages/Base/Light";


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
        path: '/circleElement',
        name: 'circleElement',
        element: <CircleElement/>
      },
      {
        path: '/coordinateSpace',
        name: 'coordinateSpace',
        element: <CoordinateSpace/>
      },
      {
        path: '/lightPage',
        name: 'lightPage',
        element: <LightPage />
      }
    ]
  },
  {
    path: '/transform',
    name: 'transform',
    children: [
      {
        path: '/rotate',
        name: 'rotate',
        element: <RotateTransform />
      }
    ]
  },
  {
    path: '/advanced',
    name: 'Advanced',
    children: []
  }
]

export default menuConfig
