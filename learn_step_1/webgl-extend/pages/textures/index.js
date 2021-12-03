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
const indexIntData = new Uint16Array([
  0, 1, 2, 0, 2, 3,    // front
  4, 5, 6, 4, 6, 7,    // back
  8, 9, 10, 8, 10, 11,   // top
  12, 13, 14, 12, 14, 15,   // bottom
  16, 17, 18, 16, 18, 19,   // right
  20, 21, 22, 20, 22, 23    // left
])

// prettier-ignore
const positionFloatData = new Float32Array([
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
          uMVPMatrix: gl.getUniformLocation(program, 'uMVPMatrix'),
          uColor: gl.getUniformLocation(program, 'uColor'),
        },
      }

      gl.useProgram(programInfo.program)

      const indexBuffer = initBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, indexIntData)

      const positionBuffer = initBuffer(gl, gl.ARRAY_BUFFER, positionFloatData)

      let then = 0
      let squareRotation = 0.0

      function draw(gl, deltaTime) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        // 顶点
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        const index = programInfo.vertexLocation.aPosition
        const size = 3
        const type = gl.FLOAT
        const normalized = false
        const stride = 0
        const offset = 0

        /**
         * Position 是一个 vec4 变量
         * 使用 vertexAttribPointer 去分配 ARRAY_BUFFER 中的值
         * 参数为分配规则
         */
        gl.vertexAttribPointer(index, size, type, normalized, stride, offset)
        gl.enableVertexAttribArray(index)

        // 颜色
        gl.uniform4f(programInfo.uniformLocation.uColor, 1.0, 1.0, 0.0, 1.0)

        /**
         * 顶点索引
         * 顶点的索引缓冲区 只是存储了 26 个顶点的索引，再使用这 26 个索引去绘制图形
         *
         * 如果使用索引的话，每一个点都出现在三个面中，就要使用 26 * 3 个顶点来绘制
         */
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

        // MVP 矩阵
        const mvpMatrix = mat4.create()
        squareRotation += deltaTime

        mat4.scale(mvpMatrix, mvpMatrix, [0.25, 0.25, 0.25])
        mat4.rotateX(mvpMatrix, mvpMatrix, squareRotation)
        mat4.rotateY(mvpMatrix, mvpMatrix, squareRotation)

        gl.uniformMatrix4fv(
          programInfo.uniformLocation.uMVPMatrix,
          false,
          mvpMatrix
        )

        {
          const mode = gl.TRIANGLES
          const count = 26
          const type = gl.UNSIGNED_SHORT
          const offset = 0
          gl.drawElements(mode, count, type, offset)
        }
      }

      function render(now) {
        now *= 0.001 //转换成秒

        const deltaTime = now - then // 1s
        then = now

        draw(gl, deltaTime)

        requestAnimationFrame(render)
      }

      requestAnimationFrame(render)

      function loadTexture() {
        const texture = gl.createTexture()

        gl.bindTexture(gl.TEXTURE_2D, texture)

        const image = new Image()
        image.onload = function () {
          const target = gl.TEXTURE_2D
          const level = 0
          const internalformat = gl.RGBA
          const format = gl.RGBA
          const srcType = gl.UNSIGNED_BYTE

          gl.bindTexture(gl.TEXTURE_2D, texture)
          gl.texImage2D(target, level, internalformat, format, srcType)
        }

        image.src = 'firefox.png'

        return texture
      }
    })
  })
}

main()