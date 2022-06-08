class WangGL {
  gl
  program

  constructor(canvasId, vsId, fsId) {
    const canvas = document.getElementById(canvasId)

    if (canvas instanceof HTMLCanvasElement) {
      this.gl = canvas.getContext('webgl2')

      const vsShader = this.compileShader(vsId, this.gl.VERTEX_SHADER)
      const fsShader = this.compileShader(fsId, this.gl.FRAGMENT_SHADER)

      const program = this.linkProgram(vsShader, fsShader)

      this.program = program

      this.gl.useProgram(this.program)

      this.clearColor()
      this.clearDepth()
      this.gl.enable(this.gl.DEPTH_TEST)

      this.gl.viewport(0, 0, canvas.width, canvas.height)
    }
  }

  clearDepth() {
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT)
    this.gl.clearDepth(1.0)
  }

  clearColor() {
    this.gl.clearColor(1.0, 1.0, 1.0, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }

  linkProgram(vsShader, fsShader) {
    const prog = this.gl.createProgram()

    this.gl.attachShader(prog, vsShader)
    this.gl.attachShader(prog, fsShader)

    this.gl.linkProgram(prog)

    if (!this.gl.getProgramParameter(prog, this.gl.LINK_STATUS)) {
      console.log('gl program link failed')

      this.gl.detachShader(prog, vsShader)
      this.gl.detachShader(prog, fsShaders)

      this.gl.deleteProgram(prog)
      return null
    }

    return prog
  }

  compileShader(id, type) {
    const vsSource = document.getElementById(id).text

    if (!vsSource) {
      console.log('shader source ' + id + ' 获取失败')
    }

    const shader = this.gl.createShader(type)

    this.gl.shaderSource(shader, vsSource)
    this.gl.compileShader(shader)

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.log(id + type + 'compile shader 失败')

      this.gl.deleteShader(shader)
      return null
    }

    return shader
  }

  drawSimpleCube() {
    const { vertexPositions, indices, vertexNormals } = cube()
    const positionLoc = 0
    const normalLoc = 1

    const vao = this.gl.createVertexArray()
    this.gl.bindVertexArray(vao)

    const positionsBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionsBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexPositions, this.gl.STATIC_DRAW)

    this.gl.vertexAttribPointer(positionLoc, 3, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(positionLoc)

    const normalBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexNormals, this.gl.STATIC_DRAW)

    this.gl.vertexAttribPointer(normalLoc, 3, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(normalLoc)

    const indicesBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW)

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
    this.gl.drawElements(this.gl.TRIANGLES, indices.length, this.gl.UNSIGNED_SHORT, 0)

    this.gl.bindVertexArray(null)
  }
}

export default WangGL
