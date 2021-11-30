import {
  loadShaderFile,
  initShaderProgram,
  initBuffer,
} from '@mercator/gl-utils'
import {mat4} from 'gl-matrix'

import * as SPECTOR from 'spectorjs'

const spector = new SPECTOR.Spector()
spector.displayUI()

// prettier-ignore
const indexIntData = new Uint8Array([
  0, 1, 2, 0, 2, 3   // front
])

// prettier-ignore
const positionFloatData = new Uint8Array([
  // Front face
  -1, -1,
  1, -1,
  1, 1,
  -1, 1
])

function main() {
  const container = document.getElementById('container')
  const gl = container.getContext('webgl')

  loadShaderFile('./index.vert').then((vsSource) => {
    loadShaderFile('./index.frag').then((fsSource) => {
      const program = initShaderProgram(gl, vsSource, fsSource)

      const programInfo = {
        program,
        vertexLocation: {
          aPosition: gl.getAttribLocation(program, 'aPosition'),
        },
        uniformLocation: {
          // uMVPMatrix: gl.getUniformLocation(program, 'uMVPMatrix'),
          uColor: gl.getUniformLocation(program, 'uColor'),
        },
      }

      gl.useProgram(programInfo.program)

      const pointBuffer = initBuffer(gl, gl.ARRAY_BUFFER, positionFloatData)

      function draw(gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)


        gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer)
        gl.vertexAttribPointer()
      }

      function render() {
        draw(gl)

        requestAnimationFrame(render)
      }

      requestAnimationFrame(render)
    })
  })
}

main()
