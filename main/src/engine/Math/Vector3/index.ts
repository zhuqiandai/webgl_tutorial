/**
 * TODO
 */
class Vector3 {
  private x: number
  private y: number
  private z: number

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x
    this.y = y
    this.z = z
  }

  setX(x: number) {
    this.x = x
  }
  setY(y: number) {
    this.y = y
  }
  setZ(z: number) {
    this.z = z
  }

  add(v: Vector3) {
    this.x += v.x
    this.y += v.y
    this.z += v.z

    return this
  }

  cross(v: Vector3): Vector3 {
    this.x = this.y * v.z - this.z * v.y
    this.y = this.z * v.x - this.x * v.z
    this.z = this.x * v.y - this.y * v.x

    return this
  }

  equals(v: Vector3): boolean {
    return v.x === this.x && v.y === this.y && v.z === this.z
  }

  dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }

  /**
   * 距离
   * @param v
   * @returns {number} distance
   */
  distance(v: Vector3): number {
    const x = this.x - v.x
    const y = this.y - v.y
    const z = this.z - v.z

    return Math.hypot(x, y, z)
  }

  /**
   * 向量的模
   */
  length(): number {
    return Math.hypot(this.x, this.y, this.z)
  }

  /**
   * 求差
   */
  minus(v: Vector3) {
    this.x -= v.x
    this.y -= v.y
    this.z -= v.z

    return this
  }

  /**
   * 求负
   */
  negate(): Vector3 {
    this.x = -this.x
    this.y = -this.y
    this.z = -this.z

    return this
  }

  /**
   * 归一化
   */
  normalize(): Vector3 {
    this.x /= this.length()
    this.y /= this.length()
    this.z /= this.length()

    return this
  }
}

export default Vector3
