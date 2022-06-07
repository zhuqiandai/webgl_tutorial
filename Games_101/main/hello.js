
import Matrix4 from '../src/Matrix4.js'
import Renderer from '../src/Renderer.js'
import WangGL from '../src/WangGL.js'

const wangGL = new WangGL('canvas', 'vshader', 'fshader')

let modelMat = Matrix4.create()
modelMat = Matrix4.scale(modelMat, [0.2, 0.2, 0.2])

let rotation = 0

function draw(time) {
  wangGL.drawSimpleCube()
  wangGL.applyModel(modelMat)

  rotation += time
}

const render = new Renderer(wangGL, draw)
render.start()