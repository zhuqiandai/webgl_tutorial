/**
 * 把关于 WebGL 的操作都在 Engine 中实现
 */

import Scene from '../Scene'

class Engine {
  private _domElement: HTMLCanvasElement
  private _gl: WebGLRenderingContext | null
  private _scenes: Scene[]

  private _clear: boolean
  private _clearColor: boolean
  private _clearDepth: boolean

  constructor(canvas: HTMLCanvasElement) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('请传入一个 canavs element')
    }

    this._domElement = canvas
    this._gl = null

    this._scenes = []

    const context = canvas.getContext('webgl')
    context && (this._gl = context)
  }

  runRenderLoop(renderFunc: Function): void {
    const renderCallback = () => {
      renderFunc()
    }

    requestAnimationFrame(renderCallback)
  }

  private _initProgram() {}

  private _initShader(shaderSource: unknown) {}
}

export default Engine
