class Primitive {

  constructor(gl, program) {
    this.gl = gl
    this.program = program
  }

  createAxes() {
    if (this.gl instanceof WebGL2RenderingContext) {
      const positionLoc = 0
      const positions = [
        -2, 0, 0, 2, 0, 0,
        0, -2, 0, 0, 2, 0,
        0, 0, -2, 0, 0, 2,
      ]

      this.gl.enableVertexAttribArray(positionLoc)

      const positionBuffer = this.gl.createBuffer()
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

      this.gl.vertexAttribPointer(positionLoc, 3, this.gl.FLOAT, false, 0, 0)

      const colorLoc = this.gl.getUniformLocation(this.program, "color")
      this.gl.uniform4fv(colorLoc, [1.0, 1.0, 0.0, 1.0])

      this.gl.lineWidth(4)
      this.gl.drawArrays(this.gl.LINES, 0, positions.length);
      this.gl.lineWidth(1)
    }
  }

  createGrid() {
    
  }
}

export default Primitive