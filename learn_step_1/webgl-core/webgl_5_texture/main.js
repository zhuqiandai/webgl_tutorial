import { mat4 } from 'gl-matrix'
import { initShaderProgram } from '../../../utils/webgl_utils'
import './style.css'

const webglContainer = document.getElementById('webgl-container')
const gl = webglContainer.getContext('webgl')

const vsSource = `
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;

varying highp vec2 vTextureCoord;

void main(void) {
  gl_Position = uViewMatrix * uModelMatrix * aVertexPosition;
  vTextureCoord = aTextureCoord;
}
`

// Fragment shader program

const fsSource = `
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
  gl_FragColor = texture2D(uSampler, vTextureCoord);
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

const { positionBuffer, textureCoordBuffer, indexBuffer } = initBuffers(gl)

const texture = loadTexture(gl, 'cubetexture.png')

function initBuffers(gl) {
  // Create a buffer for the cube's vertex positions.

  const positionBuffer = gl.createBuffer()

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // Now create an array of positions for the cube.

  const positions = [
    // Front face
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
  ]

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  // Now set up the texture coordinates for the faces.

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

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
    0,
    1,
    2,
    0,
    2,
    3, // front
    4,
    5,
    6,
    4,
    6,
    7, // back
    8,
    9,
    10,
    8,
    10,
    11, // top
    12,
    13,
    14,
    12,
    14,
    15, // bottom
    16,
    17,
    18,
    16,
    18,
    19, // right
    20,
    21,
    22,
    20,
    22,
    23, // left
  ]

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

  return {
    positionBuffer,
    textureCoordBuffer,
    indexBuffer,
  }
}

gl.useProgram(program)
let radians = 0
function draw(gl, deltaTime) {
  gl.clearColor(1.0, 1.0, 1.0, 1.0) // Clear to black, fully opaque
  gl.clearDepth(1.0) // Clear everything
  gl.enable(gl.DEPTH_TEST) // Enable depth testing
  gl.depthFunc(gl.LEQUAL) // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const modelMatrix = mat4.create()
  mat4.scale(modelMatrix, modelMatrix, [0.2, 0.2, 0.2, 1])
  mat4.rotateX(modelMatrix, modelMatrix, radians)
  mat4.rotateY(modelMatrix, modelMatrix, radians)

  const modelLocation = programInfo.uniformLocations.uModelMatrix

  const viewMatrix = mat4.create()
  // mat4.lookAt(viewMatrix, [0, 0, 0], [0, 0, 1], [0, 1, 0])

  const viewLocation = programInfo.uniformLocations.uViewMatrix

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

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

  gl.uniformMatrix4fv(modelLocation, false, modelMatrix)
  gl.uniformMatrix4fv(viewLocation, false, viewMatrix)

  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0)

  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture)

  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0)

  {
    const count = 36
    const type = gl.UNSIGNED_SHORT
    const offset = 0

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

function loadTexture(gl, url) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  const level = 0
  const internalFormat = gl.RGBA
  const width = 1
  const height = 1
  const border = 0
  const srcFormat = gl.RGBA
  const srcType = gl.UNSIGNED_BYTE
  const pixel = new Uint8Array([0, 0, 255, 255]) // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  )

  const image = new Image()
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image)

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D)
    } else {
      // No, it's not a power of 2. Turn of mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    }
  }
  image.src = url

  return texture
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0
}
