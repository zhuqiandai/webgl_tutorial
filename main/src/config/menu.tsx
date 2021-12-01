import React, {LazyExoticComponent, ReactElement} from "react";
import HomePage from "src/pages";
import Triangles from "src/pages/Base/Triangles";

const lazyComponent = (element: LazyExoticComponent<any>) => <React.Suspense
  fallback={<>loading</>}>{element}</React.Suspense>

export interface MenuConfig {
  path: string,
  name?: string,
  element?: ReactElement,
}

const menuConfig: Array<MenuConfig> = [
  {
    path: '/',
    element: <HomePage/>
  },
  {
    path: '/fundamentals',
    name: 'Base',
  },
  {
    path: '/fundamentals/triangles',
    name: 'triangles',
    element: <Triangles/>
  },
  {
    path: '/advanced',
    name: 'Advanced',
  }
]

export default menuConfig
