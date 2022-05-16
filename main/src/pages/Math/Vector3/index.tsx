import React, { FC, useEffect, useRef } from 'react'
import {
  initBuffer,
  initShaderProgram,
  loadShaderFile,
} from '@mercator/gl-utils'
import { mat4 } from 'gl-matrix'

import { axisData, axisColorData } from 'src/common/axis'

interface CoordinateSpaceProps {}

const VectorMath: FC<CoordinateSpaceProps> = () => {
  const vec3 = new Float32Array([0, 0, 0, 0.8, 0.5, -0.2])
  const vec3Color = new Float32Array([0.0, 1.0, 1.0])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    loadShaderFile('vector/index.vert').then((vsSource: unknown) => {
      loadShaderFile('vector/index.frag').then((fsSource: unknown) => {
        if (canvasRef.current) {
          const gl = canvasRef.current?.getContext('webgl')

          if (!gl) return

          const program = initShaderProgram(gl, vsSource, fsSource)

          const programInfo = {
            vertex: {
              aPosition: gl.getAttribLocation(program, 'aPosition'),
              aColor: gl.getAttribLocation(program, 'aColor'),
            },
            uniform: {
              uViewMatrix: gl.getUniformLocation(program, 'uViewMatrix'),
            },
          }

          gl.useProgram(program)

          const axisBuffer = initBuffer(gl, gl.ARRAY_BUFFER, axisData)
          const axisColorBuffer = initBuffer(gl, gl.ARRAY_BUFFER, axisColorData)

          const vec3Buffer = initBuffer(gl, gl.ARRAY_BUFFER, vec3)
          const vec3ColorBuffer = initBuffer(gl, gl.ARRAY_BUFFER, vec3Color)

          function draw(gl: WebGLRenderingContext) {
            {
              gl.clearColor(0.0, 0.0, 0.0, 1.0)
              gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

              gl.enable(gl.CULL_FACE)
            }

            {
              gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer)

              const attribLocation = programInfo.vertex.aPosition
              const size = 3
              const dataType = gl.FLOAT
              const normalized = false
              const stride = 0
              const offset = 0
              gl.vertexAttribPointer(
                attribLocation,
                size,
                dataType,
                normalized,
                stride,
                offset
              )
              gl.enableVertexAttribArray(attribLocation)

              gl.bindBuffer(gl.ARRAY_BUFFER, axisColorBuffer)
              const colorLocation = programInfo.vertex.aColor
              const colorSize = 3
              gl.vertexAttribPointer(
                colorLocation,
                colorSize,
                dataType,
                normalized,
                stride,
                offset
              )
              gl.enableVertexAttribArray(colorLocation)

              const mode = gl.LINES
              const first = 0
              const count = 6
              gl.drawArrays(mode, first, count)
            }

            {
              gl.bindBuffer(gl.ARRAY_BUFFER, vec3Buffer)

              const attribLocation = programInfo.vertex.aPosition
              const size = 3
              const dataType = gl.FLOAT
              const normalized = false
              const stride = 0
              const offset = 0
              gl.vertexAttribPointer(
                attribLocation,
                size,
                dataType,
                normalized,
                stride,
                offset
              )
              gl.enableVertexAttribArray(attribLocation)

              gl.bindBuffer(gl.ARRAY_BUFFER, vec3ColorBuffer)
              const colorLocation = programInfo.vertex.aColor
              const colorSize = 3
              gl.vertexAttribPointer(
                colorLocation,
                colorSize,
                dataType,
                normalized,
                stride,
                offset
              )
              gl.enableVertexAttribArray(colorLocation)

              const mode = gl.LINES
              const first = 0
              const count = 2
              gl.drawArrays(mode, first, count)
            }

            {
              const viewMatrix = mat4.create()

              mat4.lookAt(viewMatrix, [2, 2, 1], [0, 0, -1], [0, 1, 0])

              const viewLocation = programInfo.uniform.uViewMatrix
              gl.uniformMatrix4fv(viewLocation, false, viewMatrix)
            }
          }

          function render() {
            if (gl) {
              draw(gl)
            }

            requestAnimationFrame(render)
          }

          requestAnimationFrame(render)
        }
      })
    })
  }, [])

  return (
    <>
      <canvas ref={canvasRef} width={800} height={800} className="canvas-ref" />
    </>
  )
}

export default VectorMath
