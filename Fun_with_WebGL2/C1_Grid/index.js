import MinerGL from '../Miner/GL/MinerGL.js'
import MinerShader from '../Miner/GL/MinerShader.js'
import MinerRenderLoop from '../Miner/GL/MinerRenderLoop.js'

window.onload = () => {
  const canvas = document.getElementById('canvas')

  const miner = new MinerGL({ canvas })

  const program = new MinerShader(miner.gl, 'vshader', 'fshader').createProgram()

  miner.gl.useProgram(program)

  const renderLoop = new MinerRenderLoop()

  renderLoop.start()
}
