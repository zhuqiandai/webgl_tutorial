import Renderer from '../Renderer'

window.onload = () => {
  const canvas = document.getElementById('canvas')

  const renderer = new Renderer(canvas)

  const vs = `

    attribute vec4 aVertexPosition;

    void main()
    {
      gl_Position = aVertexPosition;
    }
  `

  const fs = `
    void main()
    {
      gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0); 
    }
  `

  console.log(renderer, vs, fs)
}
