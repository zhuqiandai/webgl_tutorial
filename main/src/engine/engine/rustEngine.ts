import { IContextAttribute } from './interface/IContextAttribute'
import { IEngineOptions } from './interface/IEngineOptions'
import { IPipeLineContext } from './interface/IPipeLineContext'

export class RustEngine {
  protected gl: WebGLRenderingContext
  protected glProgram: WebGLProgram
  protected pipeLineContext: IPipeLineContext
  protected contextAttirbute: IContextAttribute

  constructor(canvasElement: HTMLCanvasElement, opts: IEngineOptions) {
    this.contextAttirbute = {
      alpha: opts.alpha ?? true,
      antialias: opts.antialias ?? true,
      stencial: opts.stencial ?? true,
    }

    const context = canvasElement.getContext('webgl', this.contextAttirbute)

    if (context) {
      this.gl = <WebGLRenderingContext>context
      this.pipeLineContext = {}
    }
  }

  public runRenderLoop(renderFunction: () => void) {
    this.beginFrame()

    this._runRenderLoop(renderFunction)

    this.endFrame()
  }

  private _runRenderLoop(renderFunction: () => void) {}

  protected createProgram() {}

  protected createShader() {}

  protected beginFrame() {}

  protected endFrame() {}
}
