import { glMatrix } from 'gl-matrix'
import { initShaderProgram } from '../../utils/webgl_utils'
import './style.css'

const $webglContainer = document.getElementById('webgl-container')
const gl = $webglContainer.getContext('webgl')

const vsSource = `
  attribute vec4 aVertexPosition;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uTranslateControl;

  void main() {
    gl_Position = uModelViewMatrix * uTranslateControl * aVertexPosition;
  }
`

const fsSource = `
  precision lowp float;

  void main() {
    // 这里可以直接赋值，也可以在 js 中获取 location 赋值
    // 如果需要根据顶点颜色呈现不同状态，就需要使用 varying 变量
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1);
  }
`

const program = initShaderProgram(gl, vsSource, fsSource)
