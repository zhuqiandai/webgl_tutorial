/**
 *  平移 旋转 缩放
 */

import { initShaderProgram } from '../webgl_utils'
import './style.css'

const $webglContainer = document.getElementById('webgl-container')
const gl = $webglContainer.getContext('webgl')

const $translateX = document.getElementById('translateX')
const $translateXspan = document.getElementById('translateX-span')
const $translateY = document.getElementById('translateY')
const $translateYspan = document.getElementById('translateY-span')
const $ratoteX = document.getElementById('ratoteX')
const $ratoteXspan = document.getElementById('ratoteX-span')
const $rotateY = document.getElementById('rotateY')
const $rotateYspan = document.getElementById('rotateY-span')

{
  $translateX.value = 0
  $translateX.max = $webglContainer.clientWidth
  $translateX.min = -1 * $translateX.max

  $translateY.value = 0
  $translateY.max = $webglContainer.clientHeight
  $translateY.min = -1 * $translateY.max
}

function onTranslate(e, param) {
  console.log(e.target.value, param)
}

$translateX.oninput = (e) => onTranslate(e, 'x')

const vsSource = `
  attribute vec4 aVertexPosition;

  uniform mat4 uModelViewMatrix;
  // uniform mat4 uTranslateControl;

  void main() {
    gl_Position = uModelViewMatrix * aVertexPosition;
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

const programInfo = {
  program,
  attribLocations: {
    aVertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
  },
  uniformLocations: {
    uModelViewMatrix: gl.getUniformLocation(program, 'uModelViewMatrix'),
    // uTranslateControl: gl.getUniformLocation(program, 'uTranslateControl'),
  },
}

// 要先 useProgram 在设置 uniform 的值
gl.useProgram(programInfo.program)

function initBuffers(gl) {
  const buffers = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers)

  // prettier-ignore
  const postionArray = new Float32Array([
    -0.1, 0.1, 0.0,
    0.1, 0.1, 0.0,
    0.1, -0.1, 0.0,
    -0.1, -0.1, 0.0,
  ])

  gl.bufferData(gl.ARRAY_BUFFER, postionArray, gl.STATIC_DRAW)

  return buffers
}

function draw(gl, translateVal) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  gl.clear(gl.COLOR_BUFFER_BIT)

  const postionBuffers = initBuffers(gl)

  {
    const numComponents = 3 // pull out 3 values per iteration
    const type = gl.FLOAT // the data in the buffer is 32bit floats
    const normalize = false // don't normalize
    const stride = 0 // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0 // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, postionBuffers)
    gl.vertexAttribPointer(
      programInfo.attribLocations.aVertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    )
    gl.enableVertexAttribArray(programInfo.attribLocations.aVertexPosition)
  }

  {
    // prettier-ignore
    const modelViewMatrix = new Float32Array([
      1.0, 0.0, 0.0, 0.2,
      0.0, 1.0, 0.0, 0.3,
      0.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 0.0, 1.0,
    ])

    // // prettier-ignore
    // const translateControlV = new Float32Array([
    //   1.0, 0.0, 0.0, 0.0,
    //   0.0, 1.0, 0.0, 0.0,
    //   0.0, 0.0, 1.0, 0.0,
    //   0.0, 0.0, 0.0, 1.0,
    // ])

    gl.uniformMatrix4fv(programInfo.uniformLocations.uModelViewMatrix, false, modelViewMatrix)
    // gl.uniformMatrix4fv(programInfo.uniformLocations.uTranslateControl,false, translateControlV)
  }

  {
    const offset = 0
    const vertexCount = 4
    gl.drawArrays(gl.TRIANGLE_FAN, offset, vertexCount)
  }
}

draw(gl, 0.1)
