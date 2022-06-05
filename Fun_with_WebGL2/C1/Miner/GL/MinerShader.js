class MinerShader {
  gl

  vShader
  fShader

  constructor(gl, vid, fid) {
    if (gl instanceof WebGL2RenderingContext) {
      this.gl = gl

      this.vShader = this.createShader(gl, this.source(vid), gl.VERTEX_SHADER)
      this.fShader = this.createShader(gl, this.source(fid), gl.FRAGMENT_SHADER)
    }
  }

  source(id) {
    const ele = document.getElementById(id)

    if (!ele || ele.text == '') {
      console.error(id + ' shader not found or no text.')
      return null
    }

    return ele.text
  }

  createShader(gl, src, type) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, src)
    gl.compileShader(shader)

    //Get Error data if shader failed compiling
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Error compiling shader : ' + src, gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }

    return shader
  }

  createProgram() {
    //Link shaders together
    const prog = this.gl.createProgram()
    this.gl.attachShader(prog, this.vShader)
    this.gl.attachShader(prog, this.fShader)
    this.gl.linkProgram(prog)

    //Check if successful
    if (!this.gl.getProgramParameter(prog, this.gl.LINK_STATUS)) {
      console.error('Error creating shader program.', this.gl.getProgramInfoLog(prog))
      this.gl.deleteProgram(prog)
      return null
    }

    //Can delete the shaders since the program has been made.
    this.gl.detachShader(prog, this.vShader) //TODO, detaching might cause issues on some browsers, Might only need to delete.
    this.gl.detachShader(prog, this.fShader)
    this.gl.deleteShader(this.fShader)
    this.gl.deleteShader(this.vShader)

    return prog
  }
}

export default MinerShader
