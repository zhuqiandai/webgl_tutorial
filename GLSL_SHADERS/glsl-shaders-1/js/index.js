import * as THREE from 'three'


const vshader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * 1.0, 1.0);
  }
`
const fshader = `
  uniform vec3 u_color;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;

  void main() {
    // vec2 v = u_mouse / u_resolution;
    // vec3 color = vec3(v.x, 0.0, v.y);
    
    // vec3 color = vec3(sin(u_time) + 1.0 / 2.0, 0.0, cos(u_time) + 1.0 / 2.0);
    gl_FragColor = vec4(color, 1.0);
  }
`

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

// 传递封装的 uniform 变量
const uniforms = {
  u_mouse: {value: {x: 0.0, y: 0.0}},
  u_resolution: {value: {x: 0, y: 0}},
  u_time: {value: 0.0},
  u_color: {value: new THREE.Color(0xFF0000)}
}

const clock = new THREE.Clock();
const geometry = new THREE.PlaneGeometry(2, 2)
const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vshader,
  fragmentShader: fshader
})

const mesh = new THREE.Mesh(geometry, material)

camera.position.z = 1;
camera.position.y = 1

scene.add(mesh)

window.addEventListener('resize', onWindowResize, false);
document.addEventListener('mousemove', onMouseMove)

function animate() {
  requestAnimationFrame(animate)

  uniforms.u_time.value = clock.getElapsedTime();

  renderer.render(scene, camera)
}

function onMouseMove(evt) {
  uniforms.u_mouse.value.x = (evt.touches) ? evt.touches[0].clientX : evt.clientX;
  uniforms.u_mouse.value.y = (evt.touches) ? evt.touches[0].clientY : evt.clientY;
}

function onWindowResize(event) {
  const aspectRatio = window.innerWidth / window.innerHeight;
  let width, height;
  if (aspectRatio >= 1) {
    width = 1;
    height = (window.innerHeight / window.innerWidth) * width;
  } else {
    width = aspectRatio;
    height = 1;
  }
  camera.left = -width;
  camera.right = width;
  camera.top = height;
  camera.bottom = -height;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.x = window.innerWidth;
  uniforms.u_resolution.value.y = window.innerHeight;
}

animate()
