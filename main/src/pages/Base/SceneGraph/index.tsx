import React, {useRef, useEffect} from 'react';
// @ts-ignore
import {initShaderProgram, initBuffer, loadShaderFile} from '@mercator/gl-utils'

interface Props {
}

export default function Triangles(props: Props) {

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // prettier-ignore
  const positionData = new Float32Array([
    0.0, 0.0, 1.0,
  ])

  useEffect(() => {
    if (canvasRef.current) {
      const gl = canvasRef.current.getContext('webgl')

      if (gl) {


        loadShaderFile(`triangles/index.vert`).then((vsSource: unknown) => {
          loadShaderFile(`triangles/index.frag`).then((fsSource: unknown) => {
            const program = initShaderProgram(gl, vsSource, fsSource)

            const positionBuffer = initBuffer(gl, gl.ARRAY_BUFFER, positionData)

            const programInfo = {
              program,
              vertexLocation: {
                aPosition: gl.getAttribLocation(program, 'aPosition')
              },
              uniformLocation: {
                uColor: gl.getUniformLocation(program, 'uColor')
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
              }

              {
                // exe
                const mode = gl.POINTS
                const first = 0
                const count = 11

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
      <canvas width={800} height={800} className="canvas-ref" ref={canvasRef}/>
    </div>
  );
};
