import { mat4 } from 'gl-matrix'
import { initShaderProgram } from '../../utils/webgl_utils'
import './style.css'

const webglContainer = document.getElementById('webgl-container')
const gl = webglContainer.getContext('webgl')

const vsSource = `

  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;

  uniform mat4 uModelMatrix;
  uniform mat4 uViewMatrix;

  varying lowp vec4 vColor;

  void main(void) {
    gl_Position = uViewMatrix * uModelMatrix * aVertexPosition;

    vColor = aVertexColor;
  }
`

const fsSource = `
  varying lowp vec4 vColor;

  void main(void) {
    gl_FragColor = vColor;
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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
  },
}

gl.useProgram(program)

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
  ]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  const colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  const red = [1.0, 0.0, 0.0, 1.0]
  const green = [0.0, 1.0, 0.0, 1.0]
  const yellow = [0.0, 0.0, 1.0, 1.0]
  const black = [10.0, 0.0, 0.0, 1.0]

  const colors = []

  let i = 0
  while (i < 6) {
    colors.push(...red, ...green, ...yellow, ...black)

    i += 1
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

  // prettier-ignore
  const index = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW)

  return {
    positionBuffer,
    colorBuffer,
    indexBuffer,
  }
}

let radians = 0
function draw(gl, deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1)

  gl.clear(gl.COLOR_BUFFER_BIT)

  const { positionBuffer, colorBuffer, indexBuffer } = initBuffers(gl)

  {
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    const index = programInfo.attribLocations.aVertexPosition
    const size = 3
    const type = gl.FLOAT
    const normalized = false
    const stride = 0
    const offset = 0
    gl.vertexAttribPointer(index, size, type, normalized, stride, offset)

    gl.enableVertexAttribArray(index)
  }

  {
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)

    const index = programInfo.attribLocations.aVertexColor
    const size = 4
    const type = gl.FLOAT
    const normalized = false
    const stride = 0
    const offset = 0

    gl.vertexAttribPointer(index, size, type, normalized, stride, offset)

    gl.enableVertexAttribArray(index)
  }

  {
    const modelMatrix = mat4.create()
    mat4.scale(modelMatrix, modelMatrix, [0.1, 0.1, 0.1, 1])
    mat4.rotateX(modelMatrix, modelMatrix, radians)
    mat4.rotateY(modelMatrix, modelMatrix, radians)

    const modelLocation = programInfo.uniformLocations.uModelMatrix
    gl.uniformMatrix4fv(modelLocation, false, modelMatrix)

    const viewMatrix = mat4.create()
    mat4.lookAt(viewMatrix, [0, 0, 0], [0, 0, 1], [0, 1, 0])

    const viewLocation = programInfo.uniformLocations.uViewMatrix
    gl.uniformMatrix4fv(viewLocation, false, viewMatrix)
  }

  {
    const count = 26
    const type = gl.UNSIGNED_SHORT
    const offset = 0

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.drawElements(gl.TRIANGLES, count, type, offset)
  }

  radians += deltaTime
}

let then = 0

function render(now) {
  now *= 0.001 // convert to seconds
  const deltaTime = now - then
  then = now

  draw(gl, deltaTime)

  requestAnimationFrame(render)
}

requestAnimationFrame(render)
