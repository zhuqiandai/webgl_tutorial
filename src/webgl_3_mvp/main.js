/**
 *  平移 旋转 缩放
 */

import { glMatrix, mat4 } from 'gl-matrix'
import { initShaderProgram } from '../../utils/webgl_utils'
import './style.css'

const $webglContainer = document.getElementById('webgl-container')
const gl = $webglContainer.getContext('webgl')

const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;

   uniform mat4 uModelMatrix;
   uniform mat4 uViewMatrix;
   uniform mat4 uPerspectiveMatirx;

   varying lowp vec4 vColor;

 
   void main(void) {
     gl_Position = uPerspectiveMatirx * uViewMatrix * uModelMatrix * aVertexPosition;

     vColor = aVertexColor;
   }
 `
const fsSource = `
  varying lowp vec4 vColor;
 
   void main(void) {
     // 这里可以直接赋值，也可以在 js 中获取 location 赋值
     // 如果需要根据顶点颜色呈现不同状态，就需要使用 varying 变量
     gl_FragColor = vColor;
   }
 `

const program = initShaderProgram(gl, vsSource, fsSource)

const programInfo = {
  program,
  attribLocations: {
    aVertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
    aVertexColor: gl.getAttribLocation(program, 'aVertexColor'),
  },
  uniformLocations: {
    uModelMatrix: gl.getUniformLocation(program, 'uModelMatrix'),
    uViewMatrix: gl.getUniformLocation(program, 'uViewMatrix'),
    uPerspectiveMatirx: gl.getUniformLocation(program, 'uPerspectiveMatirx'),
  },
}

// 要先 useProgram 在设置 uniform 的值
gl.useProgram(programInfo.program)

function initBuffers(gl) {
  const positionBuffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  // prettier-ignore
  const positions = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  const colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  const faceColors = [
    [1.0, 1.0, 1.0, 1.0], // Front face: white
    [1.0, 0.0, 0.0, 1.0], // Back face: red
    [0.0, 1.0, 0.0, 1.0], // Top face: green
    [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0], // Right face: yellow
    [1.0, 0.0, 1.0, 1.0], // Left face: purple
  ]

  const colors = []
  for (let item of faceColors) {
    colors.push(...item, ...item, ...item, ...item)
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

  const indiceBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiceBuffer)
  // prettier-ignore
  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

  return {
    positionBuffer,
    colorBuffer,
    indiceBuffer,
  }
}

gl.clearColor(0.0, 0.0, 0.0, 1.0)

function draw(gl) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)

  const { positionBuffer, colorBuffer, indiceBuffer } = initBuffers(gl)

  {
    const numComponents = 3
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
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
    const numComponents = 4
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.vertexAttribPointer(
      programInfo.attribLocations.aVertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset
    )
    gl.enableVertexAttribArray(programInfo.attribLocations.aVertexColor)
  }

  {
    const modelMatrix = mat4.create()
    // 缩放
    mat4.scale(modelMatrix, modelMatrix, [0.1, 0.1, 0.1, 1])
    mat4.translate(modelMatrix, modelMatrix, [1, 1, 0, 1])

    const viewMatrix = mat4.create()
    // 视点 目标点 上方向
    mat4.lookAt(viewMatrix, [0.2, 0.2, 0], [0, 0, 1], [0, 1, 0])

    const perspectiveMatirx = mat4.create()

    gl.uniformMatrix4fv(programInfo.uniformLocations.uModelMatrix, false, modelMatrix)
    gl.uniformMatrix4fv(programInfo.uniformLocations.uViewMatrix, false, viewMatrix)
    gl.uniformMatrix4fv(programInfo.uniformLocations.uPerspectiveMatirx, false, perspectiveMatirx)
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiceBuffer)
  {
    const vertexCount = 36
    const type = gl.UNSIGNED_SHORT
    const offset = 0
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
  }
}

draw(gl)
