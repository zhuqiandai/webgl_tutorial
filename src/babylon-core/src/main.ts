import {
  Scene,
  Engine,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  MeshBuilder,
  SceneLoader,
} from 'babylonjs'

import './style.css'

const canvas = document.getElementById('container')

if (canvas) {
  const engine = new Engine(canvas as HTMLCanvasElement, true)

  const scene = new Scene(engine)
  const camera = new ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    Math.PI / 2.5,
    15,
    new Vector3(0, 0, 0),
    scene
  )

  const light = new HemisphericLight('light', new Vector3(1, 1, 0), scene)

  const box = MeshBuilder.CreateBox('box', { height: 1, depth: 3 }, scene)
  box.position.y = 0.5

  MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene)

  SceneLoader.ImportMeshAsync(
    'model',
    'https://assets.babylonjs.com/meshes/',
    'box.babylon'
  )

  camera.attachControl(canvas, true)

  engine.runRenderLoop(() => {
    scene.render()
  })

  window.addEventListener('resize', () => {
    engine.resize()
  })
}
