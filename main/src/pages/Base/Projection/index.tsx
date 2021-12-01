import React, {useRef, useEffect} from 'react';
// @ts-ignore
import {initShaderProgram, initBuffer, loadShaderFile} from '@mercator/gl-utils'
import {mat4} from 'gl-matrix'

interface Props {
}

export default function Triangles(props: Props) {

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // prettier-ignore
  const positionData = new Float32Array([
    // Front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, -1.0
    - 1.0, 1.0, 1.0,
  ])

  useEffect(() => {
    if (canvasRef.current) {
      const gl = canvasRef.current.getContext('webgl')

      if (gl) {
        loadShaderFile(`triangles/index.vert`).then((vsSource: string) => {
          loadShaderFile(`triangles/index.frag`).then((fsSource: string) => {
            const program = initShaderProgram(gl, vsSource, fsSource)

            const positionBuffer = initBuffer(gl, gl.ARRAY_BUFFER, positionData)

            const programInfo = {
              program,
              vertexLocation: {
                aPosition: gl.getAttribLocation(program, 'aPosition')
              },
              uniformLocation: {
                uColor: gl.getUniformLocation(program, 'uColor'),
                uMVPMatrix: gl.getUniformLocation(program, 'uMVPMatrix')
              }
            }

            gl.useProgram(programInfo.program)

            const draw = (gl: WebGLRenderingContext) => {
              {
                // prepare
                gl.clearColor(0.0, 0.0, 0.0, 1.0)
                gl.clear(gl.COLOR_BUFFER_BIT)
              }

              {
                // position
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

                const location = programInfo.vertexLocation.aPosition
                const size = 3
                const type = gl.FLOAT
                const normalized = false
                const stride = 0
                const offset = 0

                gl.vertexAttribPointer(location, size, type, normalized, stride, offset)
                gl.enableVertexAttribArray(location)
              }

              {
                // projection
                const mvpMatrix = mat4.create()

                const location = programInfo.uniformLocation.uMVPMatrix
                gl.uniformMatrix4fv(location, false, mvpMatrix)
              }

              {
                // color
                const location = programInfo.uniformLocation.uColor

                gl.uniform4f(location, 0.2, 0.5, 0.0, 1.0)
              }

              {
                // exe
                const mode = gl.TRIANGLES
                const first = 0
                const count = 36

                gl.drawArrays(mode, first, count)
              }
            }

            draw(gl)
          })
        })
      }
    }
  }, [])

  return (
    <div id="container">
      <canvas className="canvas-ref" ref={canvasRef}/>
    </div>
  );
};
