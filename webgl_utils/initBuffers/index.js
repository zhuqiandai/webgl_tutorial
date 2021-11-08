export default function initBuffers(gl) {
  const positionBuffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // prettier-ignore
  const vertices = [
     1.0, 1.0, 0.0, 
    -1.0, 1.0, 0.0, 
    1.0, -1.0, 0.0, 
    -1.0, -1.0, 0.0
  ]

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

  const colorBuffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)

  // prettier-ignore
  const colors = [
    1.0,  0.0,  1.0,  1.0,    // 白
    1.0,  1.0,  0.0,  1.0,    // 红
    0.0,  1.0,  1.0,  1.0,    // 绿
    0.0,  1.0,  1.0,  1.0,    // 蓝
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

  return {
    position: positionBuffer,
    color: colorBuffer
  }
}
