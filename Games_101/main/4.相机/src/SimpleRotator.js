class SimpleRotator {

  canvas
  callback

  constructor(canvasId, callback) {
    const canvas = document.getElementById(canvasId)

    if (canvas instanceof HTMLCanvasElement) {
      this.canvas = canvas
      this.callback = callback

      this.canvas.addEventListener("mousedown", this.doMouseDown, false)
      this.canvas.addEventListener("touchstart", this.doTouchStart, false)

      this.xLimit = 85
      this.degreesPerPixelX = 90 / canvas.height
      this.degreesPerPixelY = 180 / canvas.width

      this.center = null

      this.rotateX = 0
      this.rotateY = 0
    }
  }

  getXLimit() {
    return this.xLimit
  }

  setXLimit(limitInDegrees) {
    this.xLimit = Math.min(85, Math.max(0, limitInDegrees));
  }

  getRotationCenter() {
    return (this.center === null) ? [0, 0, 0] : this.center;
  }

  setRotationCenter(rotationCenter) {
    this.center = rotationCenter
  }

  getAngles() {
    return [this.rotateX, this.rotateY];
  }

  setAngles(rotY, rotX) {
    this.rotateX = Math.max(-this.xLimit, Math.min(this.xLimit, rotX));
    this.rotateY = rotY;
    if (this.callback) {
      this.callback.call(this);
    }
  }

  doMouseDown() {
    console.log('down')
  }

  doTouchStart() {
    console.log('touch')
  }

  doMouseDrag() { }

  doMouseUp() { }

}

export default SimpleRotator