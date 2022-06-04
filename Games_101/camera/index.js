import Renderer from './Renderer.js'

window.onload = () => {
  const canvas = document.getElementById('canvas')

  const data = {
    camerax: 0,
    cameray: 0,
    cameraz: 0,

    direction: 1,
    up: 1
  };

  const gui = new dat.GUI();
  const cameragui = gui.addFolder('camera');

  cameragui.add(data, "camerax", -1, 1, 0.1);
  cameragui.add(data, "cameray", -1, 1, 0.1);
  cameragui.add(data, "cameraz", -1, 1, 0.1);

  cameragui.add(data, "direction", -1, 1, 0.1);
  cameragui.add(data, "up", -1, 1, 0.1);

  cameragui.open()

  const vs = `
    attribute vec4 aVertexPosition;
    uniform mat4 uTransCameraMat;
    uniform mat4 uRotateCameraMat;

    void main()
    {
      gl_Position = uRotateCameraMat * uTransCameraMat * aVertexPosition;
    }
  `

  const fs = `
    void main()
    {
      gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0); 
    }
  `

  const trianglePosition = [
    0.5, -0.5, -0.3,
    0,  0.5, -0.3,
    -0.5, -0.5, -0.3,

    1,  0, -0.3,
    0.5, 1, -0.3,
    0, 0, -0.3,

    0,  -1, -0.3,
    -0.5, 0, -0.3,
    -1, -1, -0.3
  ]

  const renderer = new Renderer(canvas, vs, fs)

  function render() {
    const {camerax, cameray, cameraz, direction, up} = data

    const transCamera = [
      1, 0, 0, -camerax,
      0, 1, 0, -cameray,
      0, 0, 1, -cameraz,
      0, 0, 0, 1
    ]

    const rotateCamera = [
      direction, 0, 0, 0,
      0, up, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]

    renderer.draw(trianglePosition)

    renderer.applyTransCamera(transCamera)
    renderer.applyRoateCamera(rotateCamera)

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)

}
