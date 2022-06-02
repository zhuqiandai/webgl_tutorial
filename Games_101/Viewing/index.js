import Renderer from '../Renderer.js'

window.onload = () => {
  const { mat4, vec3 } = glMatrix
  const gui = new dat.GUI()

  const guiObj = {
    camera_z: 0,
    far: 100,
  }

  const orth = gui.addFolder('orth')
  orth.add(guiObj, 'camera_z', 0, 10, 1)
  orth.add(guiObj, 'far', 0, 100, 1)

  orth.open()

  const canvas = document.getElementById('canvas')

  const width = (canvas.width = 800)
  const height = (canvas.height = 800)

  const vs = `
    attribute vec4 aVertexPosition;
    
    uniform mat4 uModelMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectMatrix;

    void main()
    {
      gl_Position = uProjectMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
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

  const modelMatrix = mat4.create()

  /*
    1. 相机位置 -> origin 原点
    2. 相机正方向 -> -z
    3. 相机上方向 -> y
  */
  const viewMatrix = new Float32Array(
    [
      1, 0, 0, 0,
      0, 1, 0, 0, 
      0, 0, 1, 0, 
      0, 0, 0, 1
    ]
  )

  const projectMatrix =  new Float32Array(
    [
      1, 0, 0, 0,
      0, 1, 0, 0, 
      0, 0, 1, 0, 
      0, 0, 0, 1
    ]
  )


  mat4.fromTranslation(modelMatrix, [0, 0, -0.7])
  mat4.scale(modelMatrix, modelMatrix, [0.2, 0.2, 0.2])
  mat4.rotate(modelMatrix, modelMatrix, Math.PI / 4, [0.5, 0.5, 0.5])

  renderer.createBox(positions, 'aVertexPosition')

  function render() {
    renderer.modelMat(modelMatrix)
    renderer.viewMat(viewMatrix)
    renderer.projectMat(projectMatrix)
  
    renderer.draw()

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}
