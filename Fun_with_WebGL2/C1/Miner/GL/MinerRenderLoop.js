class MinerRenderLoop {
  callback
  isActive
  msLastFrame

  constructor(callback) {
    this.callback = callback

    this.isActive = false
    this.msLastFrame = null
  }

  run() {
    const msCurrent = performance.now()
    const deltaTime = (msCurrent - this.msLastFrame) / 1000.0

    this.msLastFrame = msCurrent

    this.callback && this.callback(deltaTime)

    if (this.isActive) {
      window.requestAnimationFrame(() => {
        this.run()
      })
    }
  }

  start() {
    this.isActive = true
    this.msLastFrame = performance.now()

    window.requestAnimationFrame(() => {
      this.run()
    })

    return this
  }
}

export default MinerRenderLoop
