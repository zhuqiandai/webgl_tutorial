import React, {useRef, useEffect, useState} from 'react';
import {initShaderProgram, initBuffer, loadShaderFile} from '@mercator/gl-utils'
import {Card, Slider} from "antd";

import './index.css'
import {glMatrix, mat3} from "gl-matrix";

export default function RotateTransform() {
  const [gl, setGl] = useState<WebGLRenderingContext>()

  const [programInfo, setProgramInfo] = useState<any>()
  const [bufferInfo, setBufferInfo] = useState<any>()
  const [transformInfo, setTransformInfo] = useState<any>()

  const canvasRef = useRef<HTMLCanvasElement>()

  // prettier-ignore
  const positionData = new Float32Array([
    -0.25, -0.25, 1.0,
    0.0, 0.25, 1.0,
    0.25, -0.25, 1.0
  ])

  const draw = () => {
    if (gl) {
      {
        // prepare
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)
      }

      {
        // position
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.position)

        const location = programInfo.vertexLocation.aPosition

        gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(location)
      }

      {
        // transform rotate
        const location = programInfo.uniformLocation.uRotate
        const rotateMatrix = transformInfo.rotate
        gl.uniformMatrix3fv(location, false, rotateMatrix)
      }

      {
        // exe
        const mode = gl.TRIANGLES
        const first = 0
        const count = 3

        gl.drawArrays(mode, first, count)
      }
    }
  }

  const render = () => {
    draw()
    requestAnimationFrame(render)
  }

  useEffect(() => {
    if (canvasRef.current) {
      const gl = canvasRef.current.getContext('webgl')

      if (gl) {
        setGl(gl)

        loadShaderFile(`rotate/index.vert`).then((vsSource: unknown) => {
          loadShaderFile(`rotate/index.frag`).then((fsSource: unknown) => {
            const program = initShaderProgram(gl, vsSource, fsSource)

            const positionBuffer = initBuffer(gl, gl.ARRAY_BUFFER, positionData)

            const programInfo = {
              program,
              vertexLocation: {
                aPosition: gl.getAttribLocation(program, 'aPosition')
              },
              uniformLocation: {
                // uColor: gl.getUniformLocation(program, 'uColor')
                uRotate: gl.getUniformLocation(program, 'uRotate')
              }
            }

            const bufferInfo = {
              position: positionBuffer
            }

            const transformInfo = {
              rotate: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])
            }

            setProgramInfo(programInfo)
            setBufferInfo(bufferInfo)
            setTransformInfo(transformInfo)
          })
        })
      }
    }
  }, [])

  useEffect(() => {
    if (gl && programInfo && bufferInfo && transformInfo) {
      gl.useProgram(programInfo.program)

      render()
    }
  }, [gl, programInfo, bufferInfo, transformInfo])

  const onSliderChange = (degrees: number, type: string) => {
    const radians = glMatrix.toRadian(degrees)

    const rotateMatrix = transformInfo.rotate ?? mat3.create()

    switch (type) {
      case 'x':
        const matrixX = [
          1, 0, 0,
          0, Math.cos(radians), Math.sin(radians),
          0, -Math.sin(radians), Math.cos(radians)
        ]

        mat3.multiply(rotateMatrix, rotateMatrix, new Float32Array(matrixX))
        break;
      case 'y':
        const matrixY = [
          Math.cos(radians), 0, Math.sin(radians),
          0, 1, 0,
          -Math.sin(radians), 0, Math.cos(radians)
        ]

        mat3.multiply(rotateMatrix, rotateMatrix, new Float32Array(matrixY))
        break;
      case 'z':
        const matrixZ = [
          Math.cos(radians), Math.sin(radians), 0,
          -Math.sin(radians), Math.cos(radians), 0,
          0, 0, 1
        ]

        mat3.multiply(rotateMatrix, rotateMatrix, new Float32Array(matrixZ))
        break;
    }


    if (rotateMatrix) {
      const transformAssign = Object.assign(transformInfo, {
        rotate: rotateMatrix
      })

      setTransformInfo(transformAssign)

      render()
    }
  }

  return (
    <div id="container">
      <canvas width={800} height={800} className="canvas-ref" ref={canvasRef}/>

      <Card className="card">

        <span>绕 x 轴旋转角度:</span>

        <Slider min={0} max={360}
                onChange={(val) => onSliderChange(val, 'x')}/>

        <br/>

        <span>绕 y 轴旋转角度:</span>

        <Slider min={0} max={360}
                onChange={(val) => onSliderChange(val, 'y')}/>

        <br/>

        <span>绕 z 轴旋转角度:</span>

        <Slider min={0} max={360}
                onChange={(val) => onSliderChange(val, 'z')}/>

      </Card>
    </div>
  );
};
