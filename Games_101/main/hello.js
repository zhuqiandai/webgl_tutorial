
import Renderer from '../src/Renderer.js'
import WangGL from '../src/WangGL.js'

const { mat4 } = glMatrix

const wangGL = new WangGL('canvas', 'vshader', 'fshader')


const fieldOfView = 45 * Math.PI / 180;   // in radians
const aspect = 1;
const zNear = 0.1;
const zFar = 100.0;
const projectionMatrix = mat4.create();

mat4.perspective(projectionMatrix,
  fieldOfView,
  aspect,
  zNear,
  zFar);

const modelViewMatrix = mat4.create()
mat4.translate(modelViewMatrix,     // destination matrix
  modelViewMatrix,     // matrix to translate
  [-0.0, 0.0, -20.0]);  // amount to translate


function draw(time) {
  wangGL.clearColor()
  wangGL.clearDepth()

  wangGL.drawSimpleCube()

  wangGL.applyProejction(projectionMatrix)

  mat4.rotate(modelViewMatrix,  // destination matrix
    modelViewMatrix,  // matrix to rotate
    time,     // amount to rotate in radians
    [0, 0, 1]);       // axis to rotate around (Z)
  mat4.rotate(modelViewMatrix,  // destination matrix
    modelViewMatrix,  // matrix to rotate
    time * .7,// amount to rotate in radians
    [0, 1, 0]);
  wangGL.applyModel(modelViewMatrix)
}

const render = new Renderer(draw)
render.start()