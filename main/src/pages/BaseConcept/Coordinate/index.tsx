import React, {FC, useEffect, useRef} from 'react'
import {initBuffer, initShaderProgram, loadShaderFile} from '@mercator/gl-utils'
import {mat4} from 'gl-matrix'

interface CoordinateSpaceProps {

}

const CoordinateSpace: FC<CoordinateSpaceProps> = () => {

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const axis = [-0.8, 0, 0, 0.8, 0, 0, 0, -0.8, 0, 0, 0.8, 0, 0, 0, -0.8, 0, 0, 0.8]
  const axisData = new Float32Array(axis)

  const axisArrow = [
    0.9, 0, 0,
    0.8, 0.1, 0,
    0.8, 0.1 * Math.sin(45), 0.1 * Math.cos(45),

    0.9, 0, 0,
    0.8, 0.1 * Math.sin(45), 0.1 * Math.cos(45),
    0.8, 0, 0.1,

    0.9, 0, 0,
    0.8, 0, 0.1,
    0.8, -0.1 * Math.sin(45), 0.1 * Math.cos(45),

    0.9, 0, 0,
    0.8, -0.1 * Math.sin(45), 0.1 * Math.cos(45),
    0.8, -0.1, 0,

    0.9, 0, 0,
    0.8, -0.1, 0,
    0.8, -0.1 * Math.sin(45), -0.1 * Math.cos(45),

    0.9, 0, 0,
    0.8, -0.1 * Math.sin(45), -0.1 * Math.cos(45),
    0.8, 0, -0.1,

    0.9, 0, 0,
    0.8, -0.1 * Math.sin(45), 0.1 * Math.cos(45),
    0.8, 0, -0.1,

    0.9, 0, 0,
    0.8, -0.1 * Math.sin(45), 0.1 * Math.cos(45),
    0.8, 0.1, 0,
  ]

  const axisArrowData = new Float32Array(axisArrow)

  useEffect(() => {
    loadShaderFile('coordinate/index.vert').then((vsSource: unknown) => {
      loadShaderFile('coordinate/index.frag').then((fsSource: unknown) => {
        if (canvasRef.current) {
          const gl = canvasRef.current?.getContext('webgl')

          const program = initShaderProgram(gl, vsSource, fsSource)

          const programInfo = {
            vertex: {
              aPosition: gl.getAttribLocation(program, 'aPosition')
            },
            uniform: {
              uViewMatrix: gl.getUniformLocation(program, 'uViewMatrix')
            }
          }

          gl.useProgram(program)

          const axisBuffer = initBuffer(gl, gl.ARRAY_BUFFER, axisData)
          const axiosArrowBuffer = initBuffer(gl, gl.ARRAY_BUFFER, axisArrowData)

          function draw(gl) {
            {
              gl.clearColor(0.0, 0.0, 0.0, 1.0)
              gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

              gl.enable(gl.CULL_FACE)
            }

            {
              const viewMatrix = mat4.create()

              mat4.lookAt(viewMatrix, [2, 2, -1], [0, 0, 1], [0, 1, 0])

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

              const mode = gl.LINES
              const first = 0
              const count = 6
              gl.drawArrays(mode, first, count)
            }

            {
              gl.bindBuffer(gl.ARRAY_BUFFER, axiosArrowBuffer)

              const attribLocation = programInfo.vertex.aPosition
              const size = 3
              const dataType = gl.FLOAT
              const normalized = false
              const stride = 0
              const offset = 0
              gl.vertexAttribPointer(attribLocation, size, dataType, normalized, stride, offset)
              gl.enableVertexAttribArray(attribLocation)

              const mode = gl.TRIANGLES
              const first = 0
              const count = 24
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

export default CoordinateSpace;
