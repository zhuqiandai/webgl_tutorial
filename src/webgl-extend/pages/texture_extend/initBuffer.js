const initBuffer = (gl, bufferTarget, typedData) => {
  const buffer = gl.createBuffer()

  gl.bindBuffer(bufferTarget, buffer)

  gl.bufferData(bufferTarget, typedData, gl.STATIC_DRAW)

  return buffer
}


export default initBuffer