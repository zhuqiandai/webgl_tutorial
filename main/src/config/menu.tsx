import React, { ReactElement } from 'react'
import HomePage from 'src/pages'
import CoordinateSpace from "src/pages/BaseConcept/Coordinate";

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
  }

]

export default menuConfig
