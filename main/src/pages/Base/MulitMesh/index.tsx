import React, {useRef, useEffect} from 'react';
// @ts-ignore
import {initShaderProgram, initBuffer, loadShaderFile} from '@mercator/gl-utils'
import {mat4} from 'gl-matrix'
import {Card} from "antd";

import './index.css'

interface Props {
}

export default function MulitMesh(props: Props) {

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
    -1.0, 1.0, -1.0,

    // Front face
    -2.0, -2.0, 2.0,
    2.0, -2.0, 2.0,
    2.0, 2.0, 2.0,
    -2.0, 2.0, 2.0,

    // Back face
    -2.0, -2.0, -2.0,
    -2.0, 2.0, -2.0,
    2.0, 2.0, -2.0,
    2.0, -2.0, -2.0,

    // Top face
    -2.0, 2.0, -2.0,
    -2.0, 2.0, 2.0,
    2.0, 2.0, 2.0,
    2.0, 2.0, -2.0,

    // Bottom face
    -2.0, -2.0, -2.0,
    2.0, -2.0, -2.0,
    2.0, -2.0, 2.0,
    -2.0, -2.0, 2.0,

    // Right face
    2.0, -2.0, -2.0,
    2.0, 2.0, -2.0,
    2.0, 2.0, 2.0,
    2.0, -2.0, 2.0,

    // Left face
    -2.0, -2.0, -2.0,
    -2.0, -2.0, 2.0,
    -2.0, 2.0, 2.0,
    -2.0, 2.0, -2.0


    // // Front face
    // - 4.0, -4.0, 4.0,
    // 4.0, -4.0, 4.0,
    // 4.0, 4.0, 4.0,
    // -4.0, 4.0, 4.0,
    //
    // // Back face
    // -4.0, -4.0, -4.0,
    // -4.0, 4.0, -4.0,
    // 4.0, 4.0, -4.0,
    // 4.0, -4.0, -4.0,
    //
    // // Top face
    // -4.0, 4.0, -4.0,
    // -4.0, 4.0, 4.0,
    // 4.0, 4.0, 4.0,
    // 4.0, 4.0, -4.0,
    //
    // // Bottom face
    // -4.0, -4.0, -4.0,
    // 4.0, -4.0, -4.0,
    // 4.0, -4.0, 4.0,
    // -4.0, -4.0, 4.0,
    //
    // // Right face
    // 4.0, -4.0, -4.0,
    // 4.0, 4.0, -4.0,
    // 4.0, 4.0, 4.0,
    // 4.0, -4.0, 4.0,
    //
    // // Left face
    // -4.0, -4.0, -4.0,
    // -4.0, -4.0, 4.0,
    // -4.0, 4.0, 4.0,
    // -4.0, 4.0, -4.0
  ]
  const positionData = new Float32Array(positions)


  // prettier-ignore

  const indices = [
    // 0, 1, 2, 0, 2, 3,    // front
    // 4, 5, 6, 4, 6, 7,    // back
    // 8, 9, 10, 8, 10, 11,   // top
    // 12, 13, 14, 12, 14, 15,   // bottom
    // 16, 17, 18, 16, 18, 19,   // right
    // 20, 21, 22, 20, 22, 23,    // left
    //
    // 24, 25, 26, 24, 26, 27,    // front
    // 4, 5, 6, 4, 6, 7,    // back
    // 8, 9, 10, 8, 10, 11,   // top
    // 12, 13, 14, 12, 14, 15,   // bottom
    // 16, 17, 18, 16, 18, 19,   // right
    // 20, 21, 22, 20, 22, 23,    // left
  ]

  const len = (positions.length / 3 - 1)
  for (let i = 0; i < len; i += 4) {
    indices.push(i, i + 1, i + 2, i, i + 2, i + 3)
  }

  console.log(indices)

  const cubeVertexIndicesData = new Uint16Array(indices)

  // prettier-ignore
  const color = [
    [0.0, 1.0, 1.0, 0.4],    // Front face: white
    [1.0, 0.0, 0.0, 0.4],    // Back face: red
    [0.0, 1.0, 0.0, 0.4],    // Top face: green
    [0.0, 0.0, 1.0, 0.4],    // Bottom face: blue
    [1.0, 1.0, 0.0, 0.4],    // Right face: yellow
    [1.0, 0.0, 1.0, 0.4],     // Left face: purple
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
        loadShaderFile(`multimesh/index.vert`).then((vsSource: string) => {
          loadShaderFile(`multimesh/index.frag`).then((fsSource: string) => {
            const program = initShaderProgram(gl, vsSource, fsSource)

            const positionBuffer = initBuffer(gl, gl.ARRAY_BUFFER, positionData)
            const cubeVertexIndiceBuffer = initBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndicesData)

            const colorBuffer = initBuffer(gl, gl.ARRAY_BUFFER, colorData)

            const programInfo = {
              program,
              vertexLocation: {
                aPosition: gl.getAttribLocation(program, 'aPosition'),
                aColor: gl.getAttribLocation(program, 'aColor')
              },
              uniformLocation: {
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
                // gl.enable(gl.CULL_FACE)

                gl.enable(gl.BLEND)

                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
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
                mat4.lookAt(viewMatrix, [0, 0, 6], [0, 0, 1], [0, 1, 0])

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
                // exe
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndiceBuffer)

                const mode = gl.TRIANGLES
                const count = cubeVertexIndicesData.length
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
