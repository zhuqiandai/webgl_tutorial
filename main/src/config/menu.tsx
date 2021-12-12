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
]

export default menuConfig
