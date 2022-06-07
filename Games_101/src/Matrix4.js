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

    const s = Math.sin(rad)
    const c = Math.cos(rad)

    out[0] = mat[0] * c + mat[4] * s
    out[1] = mat[1] * c + mat[5] * s
    out[2] = mat[2] * c + mat[6] * s
    out[3] = mat[3] * c + mat[7] * s

    out[4] = -mat[0] * s + mat[4] * c
    out[5] = -mat[1] * s + mat[5] * c
    out[6] = -mat[2] * s + mat[6] * c
    out[7] = -mat[3] * s + mat[7] * c

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

}

export default Matrix4
