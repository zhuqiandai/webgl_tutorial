import React, {useRef, useEffect} from 'react';
// @ts-ignore
import {initShaderProgram, initBuffer, loadShaderFile} from '@mercator/gl-utils'
import {mat4, vec3} from 'gl-matrix'
import {Card} from "antd";

import './index.css'

interface Props {
}

export default function ReflectLight(props: Props) {

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // prettier-ignore
  const positions = [
    // Front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0
  ]

  const positionData = new Float32Array(positions)


  // prettier-ignore
  const normals: number[] = [
    // Front
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    // Back
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,

    // Top
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    // Bottom
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,

    // Right
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    // Left
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0
  ]

  const normalData = new Float32Array(normals)


  // prettier-ignore
  const cubeVertexIndicesData = new Uint16Array([
    0, 1, 2, 0, 2, 3,    // front
    4, 5, 6, 4, 6, 7,    // back
    8, 9, 10, 8, 10, 11,   // top
    12, 13, 14, 12, 14, 15,   // bottom
    16, 17, 18, 16, 18, 19,   // right
    20, 21, 22, 20, 22, 23    // left
  ])


  useEffect(() => {
    if (canvasRef.current) {
      const gl = canvasRef.current.getContext('webgl')

      if (gl) {
        loadShaderFile(`reflect/index.vert`).then((vsSource: unknown) => {
          loadShaderFile(`reflect/index.frag`).then((fsSource: unknown) => {
            const program = initShaderProgram(gl, vsSource, fsSource)

            const positionBuffer = initBuffer(gl, gl.ARRAY_BUFFER, positionData)
            const cubeVertexIndiceBuffer = initBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndicesData)

            const normalBuffer = initBuffer(gl, gl.ARRAY_BUFFER, normalData)

            const programInfo = {
              program,
              vertexLocation: {
                aPosition: gl.getAttribLocation(program, 'aPosition'),
                aNormal: gl.getAttribLocation(program, 'aNormal')
              },
              uniformLocation: {
                uModelMatrix: gl.getUniformLocation(program, 'uModelMatrix'),
                uViewMatrix: gl.getUniformLocation(program, 'uViewMatrix'),
                uProjectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),

                uLightPosition: gl.getUniformLocation(program, 'uLightPosition'),
                uLightColor: gl.getUniformLocation(program, 'uLightColor'),

                uCameraPosition: gl.getUniformLocation(program, 'uCameraPosition')
              }
            }

            let squareRotation = 0.0

            gl.useProgram(programInfo.program)

            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

            const draw = (gl: WebGLRenderingContext, time: number) => {
              {
                // prepare
                gl.clearColor(0.0, 0.0, 0.0, 1.0)
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

                gl.enable(gl.DEPTH_TEST)
                gl.enable(gl.CULL_FACE)
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
                // model transform
                const location = programInfo.uniformLocation.uModelMatrix

                const modelMatrix = mat4.create()

                squareRotation += time / 2

                mat4.scale(modelMatrix, modelMatrix, [0.75, 0.75, 0.75])
                mat4.rotateX(modelMatrix, modelMatrix, squareRotation)
                mat4.rotateY(modelMatrix, modelMatrix, squareRotation)
                mat4.rotateZ(modelMatrix, modelMatrix, squareRotation)

                gl.uniformMatrix4fv(location, false, modelMatrix)
              }

              {
                // view transform
                const location = programInfo.uniformLocation.uViewMatrix

                const viewMatrix = mat4.create()
                const cameraPosition = vec3.create()
                vec3.set(cameraPosition, 0, 0, 3)

                const cameraLocation = programInfo.uniformLocation.uCameraPosition
                gl.uniform3fv(cameraLocation, cameraPosition)

                mat4.lookAt(viewMatrix, cameraPosition, [0, 0, -1], [0, 1, 0])

                gl.uniformMatrix4fv(location, false, viewMatrix)
              }

              {
                // projection transform
                const location = programInfo.uniformLocation.uProjectionMatrix

                const projectionMatrix = mat4.create()
                mat4.perspective(projectionMatrix, 30, 1, 1, 1000)

                gl.uniformMatrix4fv(location, false, projectionMatrix)
              }

              {
                // light
                gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)

                const location = programInfo.vertexLocation.aNormal
                const size = 3
                const type = gl.FLOAT
                const normalized = false
                const stride = 0
                const offset = 0

                gl.vertexAttribPointer(location, size, type, normalized, stride, offset)
                gl.enableVertexAttribArray(location)

                const lightPosition = programInfo.uniformLocation.uLightPosition
                gl.uniform3fv(lightPosition, [0, 0, -2])

                const colorLocation = programInfo.uniformLocation.uLightColor
                gl.uniform3fv(colorLocation, [0, 1, 1])
              }

              {
                // exe
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndiceBuffer)

                const mode = gl.TRIANGLES
                const count = 36
                const type = gl.UNSIGNED_SHORT
                const offset = 0
                gl.drawElements(mode, count, type, offset)
              }
            }

            let then = 0

            function render(now: number) {
              if (gl) {
                now *= 0.001
                const time = now - then

                then = now

                resize()
                draw(gl, time)

                requestAnimationFrame(render)
              }
            }

            function resize() {
              const width = canvasRef.current?.clientWidth
              const height = canvasRef.current?.clientHeight

              if (width && height) {
                if (width !== canvasRef.current?.width || height !== canvasRef.current.height) {
                  canvasRef.current.width = width
                  canvasRef.current.height = height
                }
              }
            }

            requestAnimationFrame(render)
          })
        })
      }
    }
  }, [])

  return (
    <div id="container">
      <canvas width={800} height={800} className="canvas-ref" ref={canvasRef}/>

      <Card className="card"></Card>
    </div>
  );
};
