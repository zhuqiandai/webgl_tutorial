import React, {FC, useEffect, useRef} from 'react'
import {initBuffer, initShaderProgram, loadShaderFile} from '@mercator/gl-utils'
import {Math as ToyMath} from '@mercator/toy-webgl-engine'
import {mat4} from 'src/matrix'

interface CoordinateSpaceProps {

}

const VectorMath: FC<CoordinateSpaceProps> = () => {

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const axis = [-0.8, 0, 0, 0.8, 0, 0, 0, -0.8, 0, 0, 0.8, 0, 0, 0, -0.8, 0, 0, 0.8]
  const axisData = new Float32Array(axis)

  const axisColor = [
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
  ]
  const axisColorData = new Float32Array(axisColor)

  useEffect(() => {
    loadShaderFile('vector/index.vert').then((vsSource: unknown) => {
      loadShaderFile('vector/index.frag').then((fsSource: unknown) => {
        if (canvasRef.current) {
          const gl = canvasRef.current?.getContext('webgl')

          const program = initShaderProgram(gl, vsSource, fsSource)

          const programInfo = {
            vertex: {
              aPosition: gl.getAttribLocation(program, 'aPosition'),
              aColor: gl.getAttribLocation(program, 'aColor')
            },
            uniform: {
              uViewMatrix: gl.getUniformLocation(program, 'uViewMatrix')
            }
          }

          gl.useProgram(program)

          const axisBuffer = initBuffer(gl, gl.ARRAY_BUFFER, axisData)
          const axisColorBuffer = initBuffer(gl, gl.ARRAY_BUFFER, axisColorData)

          function draw(gl) {
            {
              gl.clearColor(0.0, 0.0, 0.0, 1.0)
              gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

              gl.enable(gl.CULL_FACE)
            }

            {
              const viewMatrix = mat4.create()

              mat4.lookAt(viewMatrix, [2, 2, 1], [0, 0, -1], [0, 1, 0])

              const viewLocation = programInfo.uniform.uViewMatrix
              gl.uniformMatrix4fv(viewLocation, false, viewMatrix)
            }

            {
              gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer)

              const attribLocation = programInfo.vertex.aPosition
              const size = 3
              const dataType = gl.FLOAT
              const normalized = false
              const stride = 0
              const offset = 0
              gl.vertexAttribPointer(attribLocation, size, dataType, normalized, stride, offset)
              gl.enableVertexAttribArray(attribLocation)


              gl.bindBuffer(gl.ARRAY_BUFFER, axisColorBuffer)
              const colorLocation = programInfo.vertex.aColor
              const colorSize = 3
              gl.vertexAttribPointer(colorLocation, colorSize, dataType, normalized, stride, offset)
              gl.enableVertexAttribArray(colorLocation)

              const mode = gl.LINES
              const first = 0
              const count = 6
              gl.drawArrays(mode, first, count)
            }
          }


          function render() {
            draw(gl)

            requestAnimationFrame(render)
          }

          requestAnimationFrame(render)
        }
      })
    })
  }, [])


  return <>
    <canvas ref={canvasRef} width={800} height={800} className="canvas-ref"/>
  </>;
}

export default VectorMath;
