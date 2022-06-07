import {
  createProgram,
  createShader,
  clearColor,
  normalCube,
  primitive,
  clearDepth,
  enableAbility,
} from '../pack/gl.js'

window.onload = () => {
  let gl = null

  const canvas = document.getElementById('canvas')

  if (canvas instanceof HTMLCanvasElement) {
    gl = canvas.getContext('webgl2')

    main(gl, canvas)
  }
}

function main(gl, canvas) {
  if (gl instanceof WebGL2RenderingContext) {
    const vsShader = createShader(gl, 'vshader', gl.VERTEX_SHADER)
    const fsShader = createShader(gl, 'fshader', gl.FRAGMENT_SHADER)

    const program = createProgram(gl, vsShader, fsShader)

    const { positions, indices } = normalCube()
    const { indiceBuffer } = primitive(gl, positions, indices)

    gl.useProgram(program)

    enableAbility(gl)

    draw(gl, canvas, program, indiceBuffer)
  }
}

function draw(gl, canvas, program, indiceBuffer) {
  if (gl instanceof WebGL2RenderingContext) {
    let cubeRotation = 0
    let then = 0

    function render(now) {
      clearColor(gl)
      clearDepth(gl)

      now *= 0.001 // convert to seconds
      const deltaTime = now - then
      then = now

      const { mat4 } = glMatrix

      const fieldOfView = (45 * Math.PI) / 180 // in radians
      const aspect = canvas.clientWidth / canvas.clientHeight
      const zNear = 0.1
      const zFar = 100.0
      const projectionMatrix = mat4.create()

      mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

      const modelViewMatrix = mat4.create()

      mat4.translate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        [-0.0, 0.0, -10.0]
      ) // amount to translate

      const modelViewLoc = gl.getUniformLocation(program, 'uModelViewMatrix')
      const projectionLoc = gl.getUniformLocation(program, 'uProjectionMatrix')

      gl.uniformMatrix4fv(modelViewLoc, false, modelViewMatrix)
      gl.uniformMatrix4fv(projectionLoc, false, projectionMatrix)

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiceBuffer)
      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)

      requestAnimationFrame(render)

      cubeRotation += deltaTime
    }

    requestAnimationFrame(render)
  }
}
