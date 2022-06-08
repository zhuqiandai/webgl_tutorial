
import Renderer from './src/Renderer.js'
import WangGL from './src/WangGL.js'

const { mat4, mat3 } = glMatrix

const wangGL = new WangGL('canvas', 'vshader', 'fshader')

function draw(time) {
  wangGL.clearColor()
  wangGL.clearDepth()
}

const render = new Renderer(draw)
render.start()