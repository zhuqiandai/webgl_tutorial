import { IEngineOptions } from './interface/IEngineOptions'
import { WheelEngine } from './wheelEngine'

export class Engine extends WheelEngine {
  constructor(canvasElement: HTMLCanvasElement, opts: IEngineOptions) {
    super(canvasElement, opts)
  }
}
