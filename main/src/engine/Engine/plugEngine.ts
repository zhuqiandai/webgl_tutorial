import { EngineCapabilities } from './engineCapabilities'

class BufferPointer {
  public active: boolean
  public index: number
  public size: number
  public type: number
  public normalized: boolean
  public stride: number
  public offset: number
  public buffer: WebGLBuffer
}

export class PlugEngine {
  public _gl: WebGLRenderingContext
  public renderingCanvas: HTMLCanvasElement

  public _caps: EngineCapabilities

  constructor(canvas: NonNullable<HTMLCanvasElement>) {
    this.caps = {}

    this.renderingCanvas = canvas

    const context = canvas.getContext('webgl')
    if (!context) {
      return
    }

    this._gl = context
  }

  public getError() {
    return
  }

  public static get Caps() {
    return this._caps
  }
}
