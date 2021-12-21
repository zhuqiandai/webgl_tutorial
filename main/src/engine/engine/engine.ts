import { IEngineOptions } from './interface/IEngineOptions'
import { RustEngine } from './rustEngine'

export class Engine extends RustEngine {
  constructor(canvasElement: HTMLCanvasElement, opts: IEngineOptions) {
    super(canvasElement, opts)
  }
}
