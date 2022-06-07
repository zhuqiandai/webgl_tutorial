class Renderer {
  isActive

  constructor( callback) {
    this.callback = callback

    this.then = 0

    this.isActive = false
  }

  run(now) {
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
