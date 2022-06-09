
import Matrix4 from './src/Matrix4.js'
import Renderer from './src/Renderer.js'
import WangGL from './src/WangGL.js'
import Primitive from './src/Primitive.js'

const { mat4, mat3 } = glMatrix

const canvas = document.getElementById('canvas')

const wangGL = new WangGL('canvas', 'vshader', 'fshader')

let modelMatrix = Matrix4.create()
let viewMatrix = Matrix4.create()

const primitive = new Primitive(wangGL.gl, wangGL.program)

function draw(time) {
  wangGL.clearColor()
  wangGL.clearDepth()

  primitive.createAxes()

  wangGL.drawSimpleCube()
  wangGL.applyModelMatrix(modelMatrix)
  wangGL.applyViewMatrix(viewMatrix)
}

const render = new Renderer(draw)
render.start()
