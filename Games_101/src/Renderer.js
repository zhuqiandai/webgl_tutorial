class Renderer {
  isActive

  constructor(wangGL, callback) {
    this.wangGL = wangGL
    this.callback = callback

    this.then = 0

    this.isActive = false
  }

  run(now) {
    this.wangGL.clearColor()
    this.wangGL.clearDepth()

    now *= 0.001

    const deltatime = now - this.then

    this.then = now

    this.callback(deltatime)

    requestAnimationFrame((now) => this.run(now))
  }

  start() {
    this.isActive = true

    requestAnimationFrame((now) => this.run(now))
  }
}

export default Renderer
