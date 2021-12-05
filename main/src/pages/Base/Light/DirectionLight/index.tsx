import React, {useRef, useEffect} from 'react';
// @ts-ignore
import {initShaderProgram, initBuffer, loadShaderFile} from '@mercator/gl-utils'
import {mat4} from 'gl-matrix'
import {Card} from "antd";

import './index.css'

interface Props {
}

export default function DirectionLight(props: Props) {

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

  const positionData = new Float32Array(positions)

  // prettier-ignore
  const cubeVertexIndicesData = new Uint16Array([
    0, 1, 2, 0, 2, 3,    // front
    4, 5, 6, 4, 6, 7,    // back
    8, 9, 10, 8, 10, 11,   // top
    12, 13, 14, 12, 14, 15,   // bottom
    16, 17, 18, 16, 18, 19,   // right
    20, 21, 22, 20, 22, 23    // left
  ])

  // prettier-ignore
  const color = [
    [1.0, 1.0, 1.0, 1.0],    // Front face: white
    [1.0, 0.0, 0.0, 1.0],    // Back face: red
    [0.0, 1.0, 0.0, 1.0],    // Top face: green
    [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
    [1.0, 0.0, 1.0, 1.0]     // Left face: purple
  ]
  const colors: number[] = []

  for (let i = 0; i < 6; i++) {

    const co = color[i]

    for (let j = 0; j < 4; j++) {
      colors.push(...co)
    }
  }

  const colorData = new Float32Array(colors)


  useEffect(() => {
    if (canvasRef.current) {
      const gl = canvasRef.current.getContext('webgl')

      if (gl) {
        loadShaderFile(`direction/index.vert`).then((vsSource: unknown) => {
          loadShaderFile(`direction/index.frag`).then((fsSource: unknown) => {
            const program = initShaderProgram(gl, vsSource, fsSource)

            const positionBuffer = initBuffer(gl, gl.ARRAY_BUFFER, positionData)
            const normalsBuffer = initBuffer(gl, gl.ARRAY_BUFFER, normalData)
            const cubeVertexIndiceBuffer = initBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndicesData)

            const colorBuffer = initBuffer(gl, gl.ARRAY_BUFFER, colorData)

            const programInfo = {
              program,
              vertexLocation: {
                aPosition: gl.getAttribLocation(program, 'aPosition'),
                aColor: gl.getAttribLocation(program, 'aColor'),

                aNormal: gl.getAttribLocation(program, 'aNormal')
              },
              uniformLocation: {
                uLightDirection: gl.getUniformLocation(program, 'uLightDirection'),
                uLightColor: gl.getUniformLocation(program, 'uLightColor'),
                uAmbientLight: gl.getUniformLocation(program, 'uAmbientLight'),

                uModelMatrix: gl.getUniformLocation(program, 'uModelMatrix'),
                uViewMatrix: gl.getUniformLocation(program, 'uViewMatrix'),
                uProjectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix')
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
                // color
                gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)

                const location = programInfo.vertexLocation.aColor
                const size = 4
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

                squareRotation += time

                mat4.scale(modelMatrix, modelMatrix, [0.75, 0.75, 0.75])
                mat4.rotateX(modelMatrix, modelMatrix, squareRotation)
                // mat4.rotateY(modelMatrix, modelMatrix, squareRotation)
                mat4.rotateZ(modelMatrix, modelMatrix, squareRotation)

                gl.uniformMatrix4fv(location, false, modelMatrix)
              }

              {
                // view transform
                const location = programInfo.uniformLocation.uViewMatrix

                const viewMatrix = mat4.create()
                mat4.lookAt(viewMatrix, [0, 0, 5], [0, 0, -1], [0, 1, 0])

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

                const normalLocation = programInfo.vertexLocation.aNormal

                const directionLocation = programInfo.uniformLocation.uLightDirection
                const colorLocation = programInfo.uniformLocation.uLightColor

                const ambientLocation = programInfo.uniformLocation.uAmbientLight

                gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer)

                const size = 3
                const type = gl.FLOAT
                const normalized = false
                const stride = 0
                const offset = 0
                gl.vertexAttribPointer(normalLocation, size, type, normalized, stride, offset)
                gl.enableVertexAttribArray(normalLocation)

                gl.uniform3fv(directionLocation, [0.0, 0.0, -1.0])
                gl.uniform3fv(colorLocation, [0.8, 0.8, 0.8])

                gl.uniform3fv(ambientLocation, [0.1, 0.1, 0.1])
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
