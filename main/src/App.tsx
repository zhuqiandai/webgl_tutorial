import React from 'react'
import {Row, Col} from 'antd'

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import LeftMenu from "src/components/LeftMenu";
import RightRouteContent from "src/components/RightRouteContent";

import './App.css'

function App() {
  return (
    <>
      <div className="app">
        <Row className="app-row">
          <Col span={4}>
            <LeftMenu/>
          </Col>
          <Col span={20}>
            <RightRouteContent/>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default App
