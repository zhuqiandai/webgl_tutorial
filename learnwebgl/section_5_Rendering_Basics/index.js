import Renderer from '../Renderer.js'

window.onload = () => {
  const canvas = document.getElementById('canvas')

  const vs = `
    attribute vec4 aVertexPosition;

    uniform uScaleMatrix;

    void main()
    {
      uniform uScaleMatrix = mat4();
      gl_Position = uScaleMatrix * aVertexPosition;
    }
  `

  const fs = `
    void main()
    {
      gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0); 
    }
  `

  const renderer = new Renderer(canvas, vs, fs)

  const positions = [
    // Front face
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
  ]


  renderer.createBox(positions, 'aVertexPosition')
  renderer.draw()
}
