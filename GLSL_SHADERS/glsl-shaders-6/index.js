const vshader = `
  varying vec2 v_uv;
  varying vec3 v_position;

  void main() {
    // 这里 uv position 都是 threejs 提供的值
    v_uv = uv;
    v_position = position;
  
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * 1.0, 1.0);
  }
`
const fshader = `
  uniform vec2 u_resolution;
  uniform vec3 u_color;
  varying vec2 v_uv;

  varying vec3 v_position;
  uniform float u_time;

  mat2 getRotationMatrix(float time)
  {
    float s = sin(time);
    float c = cos(time);

    return mat2(c, -s, s, c);
  }


  float rect(vec2 point, vec2 center,vec2 size, vec2 anchor) {
    vec2 p = point - center;

    float horz = step(-size.x - anchor.x, p.x) - step(size.x - anchor.x, p.x);
    float vert = step(-size.y - anchor.y, p.y) - step(size.y - anchor.y, p.y);

    return horz * vert;
  }

  void main(void) {  

    float tileCount = 6.0;
    float radius = 0.1;

    mat2 rotate = getRotationMatrix(u_time);
    vec2 p = fract(v_uv.xy * tileCount);
    vec2 center = vec2(0.5);

    vec2 point = rotate * (p - center) + center;
    vec2 size = vec2(0.2);
    
    vec2 anchor = vec2(0.0);
    float initRect = rect(point, center, size, anchor);
    
    vec3 color = vec3(1.0, 1.0, 0.0) * initRect;
     
    gl_FragColor = vec4(color, 1.0);
  }
`

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)

const renderer = new THREE.WebGLRenderer()

const clock = new THREE.Clock()

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

// 传递封装的 uniform 变量
const uniforms = {
  u_resolution: { value: { x: 0, y: 0 } },
  u_color: { value: new THREE.Color(0xff0000) },
  u_time: { value: 0 },
}

const geometry = new THREE.PlaneGeometry(2, 2)
const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vshader,
  fragmentShader: fshader,
})

const mesh = new THREE.Mesh(geometry, material)

camera.position.z = 1

scene.add(mesh)

window.addEventListener('resize', onWindowResize, false)

function animate() {
  requestAnimationFrame(animate)

  uniforms.u_time.value += clock.getDelta()

  renderer.render(scene, camera)
}

onWindowResize()

function onWindowResize(event) {
  const aspectRatio = window.innerWidth / window.innerHeight
  let width, height
  if (aspectRatio >= 1) {
    width = 1
    height = (window.innerHeight / window.innerWidth) * width
  } else {
    width = aspectRatio
    height = 1
  }
  camera.left = -width
  camera.right = width
  camera.top = height
  camera.bottom = -height
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)

  // 设置一下分辨率
  uniforms.u_resolution.value.x = window.innerWidth
  uniforms.u_resolution.value.y = window.innerHeight / 2
}

animate()
