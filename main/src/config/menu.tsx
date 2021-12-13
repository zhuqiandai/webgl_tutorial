import React, { ReactElement } from 'react'
import HomePage from 'src/pages'

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
  
]

export default menuConfig
