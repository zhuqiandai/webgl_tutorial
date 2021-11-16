import { mat4 } from 'gl-matrix'
import { initShaderProgram } from '../../utils/webgl_utils'
import './style.css'

const webglContainer = document.getElementById('webgl-container')
const gl = webglContainer.getContext('webgl')

const vsSource = `

  attribute vec4 aVertexPosition;

  attribute vec2 aTextureCoord;

  uniform mat4 uModelMatrix;
  uniform mat4 uViewMatrix;

  varying vec2 vTextureCoord;

  void main(void) {
    gl_Position = uViewMatrix * uModelMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
  }
`

const fsSource = `
  precision mediump float;

  uniform sampler2D uSampler;

  varying vec2 vTextureCoord;

  void main(void) {
    gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
  } 
`

const program = initShaderProgram(gl, vsSource, fsSource)

const programInfo = {
  program,
  attribLocations: {
    aVertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
    aTextureCoord: gl.getAttribLocation(program, 'aTextureCoord'),
  },
  uniformLocations: {
    uModelMatrix: gl.getUniformLocation(program, 'uModelMatrix'),
    uViewMatrix: gl.getUniformLocation(program, 'uViewMatrix'),

    uSampler: gl.getUniformLocation(program, 'uSampler'),
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

  const textureCoordBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer)

  const textureCoordinates = [
    // Front
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Back
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Top
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Bottom
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Right
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Left
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  ]

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW)

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
    textureCoordBuffer,
    indexBuffer,
  }
}

let radians = 0
function draw(gl, deltaTime) {
  gl.clearColor(1.0, 1.0, 1.0, 1)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const { positionBuffer, textureCoordBuffer, indexBuffer } = initBuffers(gl)

  const { texture } = initTexture(gl)

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
    mat4.scale(modelMatrix, modelMatrix, [0.1, 0.1, 0.1, 1])
    mat4.rotateX(modelMatrix, modelMatrix, radians)
    mat4.rotateY(modelMatrix, modelMatrix, radians)

    const modelLocation = programInfo.uniformLocations.uModelMatrix
    gl.uniformMatrix4fv(modelLocation, false, modelMatrix)

    const viewMatrix = mat4.create()
    // mat4.lookAt(viewMatrix, [0, 0, 0], [0, 0, 1], [0, 1, 0])

    const viewLocation = programInfo.uniformLocations.uViewMatrix
    gl.uniformMatrix4fv(viewLocation, false, viewMatrix)
  }

  {
    const numComponents = 2
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer)
    gl.vertexAttribPointer(
      programInfo.attribLocations.aTextureCoord,
      numComponents,
      type,
      normalize,
      stride,
      offset
    )
    gl.enableVertexAttribArray(programInfo.attribLocations.aTextureCoord)
  }

  {
    const count = 26
    const type = gl.UNSIGNED_SHORT
    const offset = 0

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.activeTexture(gl.TEXTURE0)

    gl.uniform1i(programInfo.uniformLocations.uSampler, 0)

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

function initTexture(gl) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  const image = new Image()
  image.crossOrigin = 'anonymous'

  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture)

    const target = gl.TEXTURE_2D
    const level = 0
    const internalformat = gl.RGBA
    const format = gl.RGBA
    const type = gl.UNSIGNED_BYTE

    gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texImage2D(target, level, internalformat, format, type, image)
  }

  image.src = './cubetexture.png'

  return texture
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0
}
