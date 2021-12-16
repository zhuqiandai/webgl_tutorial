const ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array

class Vector3 {
  constructor([x, y, z]: [number, number, number]) {

    if (x && y && z) {
      const vec3 = new ARRAY_TYPE(3)
      vec3[0] = x
      vec3[1] = y
      vec3[2] = z

      return vec3
    }
  }

  static clone(vec3: Vector3) {
    const out = new ARRAY_TYPE(3)
    out[0] = vec3[0]
    out[1] = vec3[1]
    out[2] = vec3[2]

    return out
  }

  static add(out: Vector3, a: Vector3, b: Vector3) {
    out[0] = a[0] + b[0]
    out[1] = a[1] + b[1]
    out[2] = a[2] + b[2]

    return out
  }

  static length(vec3: Vector3) {
    const a = vec3[0]
    const b = vec3[1]
    const c = vec3[2]

    return Math.hypot(a, b, c)
  }
}

export default Vector3
