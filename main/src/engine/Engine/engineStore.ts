declare type Engine = import('./engine').Engine
declare type Scene = import('../Scene/scene').Scene | null

class EngineStore {
  public static Instances = new Array<Engine>()

  public static _LastCreatedScene: Scene | null

  public static get LastCreatedEngine() {
    if (this.Instances.length === 0) {
      return null
    }

    return this.Instances[this.Instances.length - 1]
  }

  public static get LastCreatedScene() {
    return this._LastCreatedScene
  }
}

export default EngineStore
