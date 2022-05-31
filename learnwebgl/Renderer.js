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

  indiceBuffer

  constructor(canvas, vsSource, fsSource) {
    this.canvas = canvas

    this.vsSource = vsSource
    this.fsSource = fsSource

    if (canvas instanceof HTMLCanvasElement) {
      this.width = canvas.clientWidth
      this.height = canvas.clientHeight

      this.gl = this.canvas.getContext('webgl2')

      this.resizeCanavs()
      this.clearColorBuffer()

      this.compileShader()
      this.createProgram()
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
    this.gl.clearColor(1.0, 1.0, 1.0, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }

  draw() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indiceBuffer)

    const vertexCount = 36
    const type = this.gl.UNSIGNED_SHORT
    const offset = 0
    this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset)
  }

  createBox(vertices, attribute) {
    if (this.gl instanceof WebGL2RenderingContext) {
      const buffer = this.gl.createBuffer()
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

      this.indiceBuffer = this.gl.createBuffer()

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indiceBuffer)

      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW)
      this.gl.bufferData(
        this.gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        this.gl.STATIC_DRAW
      )

      const location = this.gl.getAttribLocation(this.program, attribute)

      const numComponents = 3
      const type = this.gl.FLOAT
      const normalize = false
      const stride = 0
      const offset = 0

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
      this.gl.vertexAttribPointer(location, numComponents, type, normalize, stride, offset)
      this.gl.enableVertexAttribArray(location)
    }
  }
}

export default Renderer
