import React, { ReactElement } from 'react'
import HomePage from 'src/pages'
import CoordinateSpace from "src/pages/BaseConcept/Coordinate";
import VectorMath from "src/pages/Math/Vector";

export interface MenuConfig {
  path: string
  name: string
  element?: ReactElement
  children?: Array<MenuConfig>
}

const menuConfig: Array<MenuConfig> = [
  {
    path: '/',
    name: 'homepage',
    element: <HomePage />,
  },
  {
    path: '/baseConcept',
    name: '核心概念',
    children: [
      {
        path: '/coordinate',
        name: '坐标系统',
        element: <CoordinateSpace />
      }
    ]
  },
  {
    path: '/math',
    name: '数学概念',
    children: [
      {
        path: '/vector',
        name: '向量',
        element: <VectorMath />
      }
    ]
  }

]

export default menuConfig
