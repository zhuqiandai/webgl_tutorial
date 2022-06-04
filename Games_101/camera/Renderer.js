class Renderer {
  gl
  canvas

  program

  vsSource
  fsSource
  vsShader
  fsShader

  width
  height

  buffer
  bufferType

  constructor(canvas, vsSource, fsSource) {
    this.canvas = canvas

    this.vsSource = vsSource
    this.fsSource = fsSource

    if (canvas instanceof HTMLCanvasElement) {
      this.width = canvas.clientWidth
      this.height = canvas.clientHeight

      this.gl = this.canvas.getContext('webgl2')

      this.compileShader()
      this.createProgram()

      this.enable()
    }
  }

  createProgram() {
    if (this.gl instanceof WebGL2RenderingContext) {
      this.program = this.gl.createProgram()

      this.gl.attachShader(this.program, this.vsShader)
      this.gl.attachShader(this.program, this.fsShader)

      this.gl.linkProgram(this.program)

      if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
        console.log('error')
      }

      this.gl.useProgram(this.program)
    }
  }

  enable() {
    if (this.gl instanceof WebGL2RenderingContext) {
      this.gl.enable(this.gl.DEPTH_TEST)
      this.gl.enable(this.gl.CULL_FACE)
    }

  }

  compileShader() {
    if (this.gl instanceof WebGL2RenderingContext) {
      this.vsShader = this.gl.createShader(this.gl.VERTEX_SHADER)
      this.gl.shaderSource(this.vsShader, this.vsSource)
      this.gl.compileShader(this.vsShader)

      this.fsShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
      this.gl.shaderSource(this.fsShader, this.fsSource)
      this.gl.compileShader(this.fsShader)
    }
  }

  resizeCanavs() {
    const pixelRatio = window.devicePixelRatio || 1

    const width = pixelRatio * this.width
    const height = pixelRatio * this.height

    this.gl.viewport(0, 0, width, height)
  }

  clearColorBuffer() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }

  clearDepthBuffer() {
    this.gl.clearDepth(1.0)
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT)
  }

  draw(positions) {
    if (this.gl instanceof WebGL2RenderingContext) {
      this.resizeCanavs()
      this.clearColorBuffer()
      this.clearDepthBuffer()

      this.createBuffer(positions)
      this.attribPointer('aVertexPosition')

      this.gl.drawArrays(this.gl.TRIANGLES, 0, positions.length)
    }
  }

  createBuffer(positions) {
    if (this.gl instanceof WebGL2RenderingContext) {
      const pos = new Float32Array(positions)

      this.buffer = this.gl.createBuffer()

      this.bufferType = this.gl.ARRAY_BUFFER

      this.gl.bindBuffer(this.bufferType, this.buffer)
      this.gl.bufferData(this.bufferType, pos, this.gl.STATIC_DRAW)
    }
  }

  attribPointer(attrib) {
    if (this.gl instanceof WebGL2RenderingContext) {
      const location = this.gl.getAttribLocation(this.program, attrib)

      const size = 3
      const type = this.gl.FLOAT
      const normalize = false
      const stride = 0
      const offset = 0

      this.gl.bindBuffer(this.bufferType, this.buffer)

      this.gl.vertexAttribPointer(location, size, type, normalize, stride, offset)
      this.gl.enableVertexAttribArray(location)
    }
  }

  applyTransCamera(camera) {
    if (this.gl instanceof WebGL2RenderingContext) {
      const location = this.gl.getUniformLocation(this.program, 'uTransCameraMat')

      this.gl.uniformMatrix4fv(location, false, camera)
    }
  }

  applyRoateCamera(camera) {
    if (this.gl instanceof WebGL2RenderingContext) {
      const location = this.gl.getUniformLocation(this.program, 'uRotateCameraMat')

      this.gl.uniformMatrix4fv(location, false, camera)
    }
  }
}

export default Renderer
