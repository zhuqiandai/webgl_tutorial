// noinspection DuplicatedCode

import * as THREE from 'three'


const vshader = `
  varying vec2 v_uv;
  varying vec3 v_position;

  void main() {
    v_uv = uv;
    v_position = position;
  
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * 1.0, 1.0);
  }
`
const fshader = `
  uniform vec2 u_resolution;
  varying vec2 v_uv;
  varying vec3 v_position;
  
  void main(void) {  
    // vec2 uv = gl_FragCoord.xy / u_resolution;
    
    // vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), uv.y);
    
    vec3 color = vec3((v_uv.x  + v_position.x) / 2.0, (v_uv.y + v_position.y) / 2.0, 0.0);
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
  u_resolution: {value: {x: 0, y: 0}},
  u_color: {value: new THREE.Color(0xFF0000)}
}


const geometry = new THREE.PlaneGeometry(2, 2)
const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vshader,
  fragmentShader: fshader
})

const mesh = new THREE.Mesh(geometry, material)

camera.position.z = 1;

scene.add(mesh)

window.addEventListener('resize', onWindowResize, false);

function animate() {
  requestAnimationFrame(animate)

  renderer.render(scene, camera)
}

onWindowResize()

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
  uniforms.u_resolution.value.y = window.innerHeight / 2;
}

animate()
