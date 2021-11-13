import { mat4 } from 'gl-matrix'
import { initShaderProgram } from '../../utils/webgl_utils'
import './style.css'

const webglContainer = document.getElementById('webgl-container')
const gl = webglContainer.getContext('webgl')

const vsSource = `

  attribute vec4 aVertexPosition;

  uniform mat4 uModelMatrix;

  void main(void) {
    gl_Position = uModelMatrix * aVertexPosition;
  }
`

const fsSource = `
  void main(void) {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  } 
`

const program = initShaderProgram(gl, vsSource, fsSource)

const programInfo = {
  program,
  attribLocations: {
    aVertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
  },
  uniformLocations: {
    uModelMatrix: gl.getUniformLocation(program, 'uModelMatrix'),
  },
}

gl.useProgram(program)

function initBuffers(gl) {
  const positionBuffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // prettier-ignore
  const positions = [
    -0.1, -0.1, 0.0,
    0.1, -0.1, 0.0,
    0, 0.1, 0.0,

    0.1, 0.1, 0.0,
    0.3, 0.1, 0.0,
    0, 0.3, 0.0,
  ]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

  const index = [0, 1, 2, 3, 4, 5]

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW)

  return {
    positionBuffer,
    indexBuffer,
  }
}

function draw(gl) {
  gl.clearColor(0.0, 0.0, 0.0, 1)

  gl.clear(gl.COLOR_BUFFER_BIT)

  const { positionBuffer, indexBuffer } = initBuffers(gl)

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
    const modelMatrix = mat4.create()

    const location = programInfo.uniformLocations.uModelMatrix
    gl.uniformMatrix4fv(location, false, modelMatrix)
  }

  {
    // const first = 0
    // const count = 6
    // gl.drawArrays(gl.TRIANGLE_FAN, first, count)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
  }
}

draw(gl)
