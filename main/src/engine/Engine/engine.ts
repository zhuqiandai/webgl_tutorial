/**
 * 把关于 WebGL 的操作都在 Engine 中实现
 */
import EngineStore from './engineStore'
import { PlugEngine } from './plugEngine'

import { Scene } from '../Scene/scene'
import { IsWindowObjectExist } from '../Misc/domManagment'


export class Engine extends PlugEngine {
  public domElement: HTMLCanvasElement

  public scenes = new Array<Scene>()

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)

    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('请传入一个 canavs element')
    }

    Engine.Instances.push(this)

    this.domElement = canvas

    if (IsWindowObjectExist()) {
    }
  }

  runRenderLoop(renderFunc: Function): void {
    const renderCallback = () => {
      renderFunc()
    }

    requestAnimationFrame(renderCallback)
  }

  private _initProgram() {}

  private _initShader(shaderSource: unknown) {}

  public static get Instances(): Engine[] {
    return EngineStore.Instances
  }

  /**
   * * Event Listener
   */
}
