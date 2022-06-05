class MinerGL {
  gl
  canvas

  constructor({ canvas }) {
    this.canvas = canvas

    if (this.canvas instanceof HTMLCanvasElement) {
      this.gl = this.canvas.getContext('webgl2')

      if (!this.gl) {
        throw new Error('No WebGL Context')
      }
    }

    this.gl.clearColor(1.0, 1.0, 1.0, 1.0)
  }

  get gl() {
    return this.gl
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    return this.gl
  }

  setSize(w, h) {
    this.canvas.style.width = w + 'px'
    this.canvas.style.height = h + 'px'
    this.canvas.width = w
    this.canvas.height = h

    this.gl.viewport(0, 0, w, h)

    return this.gl
  }
}

export default MinerGL
