export function createProgram(gl, vsShader, fsShader) {
  if (gl instanceof WebGL2RenderingContext) {
    const prog = gl.createProgram()

    gl.attachShader(prog, vsShader)
    gl.attachShader(prog, fsShader)

    gl.deleteShader(vsShader)
    gl.deleteShader(fsShader)

    gl.linkProgram(prog)

    return prog
  }
}

export function enableAbility(gl) {
  if (gl instanceof WebGL2RenderingContext) {
    gl.enable(gl.DEPTH_TEST)
  }
}

export function createShader(gl, source, type) {
  const src = document.getElementById(source)

  if (src && src.text && gl instanceof WebGL2RenderingContext) {
    const shader = gl.createShader(type)

    gl.shaderSource(shader, src.text)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log('shader' + source + '编译失败')
      gl.deleteShader(shader)
      return null
    }

    return shader
  }
}

export function clearColor(gl) {
  if (gl instanceof WebGL2RenderingContext) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
  }
}

export function clearDepth(gl) {
  if (gl instanceof WebGL2RenderingContext) {
    gl.clear(gl.DEPTH_BUFFER_BIT)
  }
}

export function normalCube() {
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

  return { positions, indices }
}

export function primitive(gl, position, indice) {
  if (gl instanceof WebGL2RenderingContext) {
    gl.enableVertexAttribArray(0)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)

    const indiceBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiceBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indice), gl.STATIC_DRAW)

    return { indiceBuffer }
  }
}
