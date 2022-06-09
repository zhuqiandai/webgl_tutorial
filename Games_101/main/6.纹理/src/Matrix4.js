class Matrix4 {
  static create() {
    const mat = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])

    return mat
  }

  static rotationZ(mat, rad) {
    const out = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])

    return out
  }
  static rotationY() { }

  static scale(mat, vec3) {
    const x = vec3[0]
    const y = vec3[1]
    const z = vec3[2]

    mat[0] *= x
    mat[5] *= y
    mat[10] *= z

    return mat
  }

  static translate(mat, vec3) {
    const x = vec3[0]
    const y = vec3[1]
    const z = vec3[2]

    mat[3] += x
    mat[7] += y
    mat[11] += z

    return mat
  }

  static perspective() { }

  static orthographic() { }

  transpose() {}

}

export default Matrix4
