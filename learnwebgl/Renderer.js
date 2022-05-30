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

  constructor(canvas, vsSource, fsSource) {
    this.canvas = canvas

    this.vsSource = vsSource
    this.fsSource = fsSource

    if (canvas instanceof HTMLCanvasElement) {
      this.width = canvas.clientWidth
      this.height = canvas.clientHeight

      this.gl = this.canvas.getContenxt('webgl2')

      this.resizeCanavs()
      this.clearColorBuffer()

      this.compileShader()
      this.createProgram()
    }
  }

  createProgram() {
    if (this.gl instanceof WebGL2RenderingContext) {
      this.program = this.gl.createProgram()

      this.gl.detachShader(this.program, this.vsShader)
      this.gl.detachShader(this.program, this.fsShader)
    }
  }

  compileShader() {
    if (this.gl instanceof WebGL2RenderingContext) {
      this.vsShader = this.gl.createShader()
      this.gl.shaderSource(this.vsShader, this.vsSource)
      this.gl.compileShader(this.vsShader)

      this.fsShader = this.gl.createShader()
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
    this.gl.clearColor(1.0, 1.0, 1.0, 1.0)
    this.gl.clear(gl.COLOR_BUFFER_BIT)
  }
}

export default Renderer
