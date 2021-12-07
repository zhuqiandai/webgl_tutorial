import React, {ReactElement} from "react";
import HomePage from "src/pages";
import CircleElement from "src/pages/Base/CircleElement";
import CoordinateSpace from "src/pages/Base/CoordinateSpace";
import RotateTransform from "src/pages/Transform/Rotate";
import DirectionLight from "src/pages/Base/Light/DirectionLight";
import PointLight from "src/pages/Base/Light/PointLight";
import ReflectLight from "src/pages/Base/Light/ReflectLight";
import MulitMesh from "src/pages/Base/MulitMesh";


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
        path: '/MulitMesh',
        name: '绘制多个物体',
        element: <MulitMesh />
      },
      {
        path: '/light',
        name: 'light',
        children: [
          {
            path: '/directionLight',
            name: 'directionLight',
            element: <DirectionLight />
          },
          {
            path: '/pointLight',
            name: 'pointLight',
            element: <PointLight />
          },
          {
            path: '/reflect',
            name: 'reflect',
            element: <ReflectLight />
          }
        ]
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
        element: <RotateTransform/>
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
