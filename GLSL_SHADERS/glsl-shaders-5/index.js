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
  
     float rect(vec2 pt, vec2 size, vec2 center){
      vec2 p = pt - center;
      
      vec2 halfsize = size * 0.2;
      
      
      // 在 [-halfsize, halfsize] 之间即为 1 - 0, 否则为 1 - 1
      float horz = step(-halfsize.x, p.x) - step(halfsize.x, p.x);
      float vert = step(-halfsize.y, p.y) - step(halfsize.y, p.y);
       
      return horz * vert;
     }
     
  
  void main(void) {  
    
    // vec3 color = vec3(0.0);
    //  
    //  color.r = clamp(v_position.x, 0.0, 1.0);
    //  color.g = clamp(v_position.y, 0.0, 1.0);
    
    // color.r = step(0.5, v_position.x);
    // color.g = step(0.1, v_position.y);
    
     // color.r = smoothstep(0.0, 1.0, v_position.x);
     // color.g = smoothstep(0.0, 1.0, v_position.y);
     
     // 绘制圆
     // float inCircle = 1.0 - smoothstep(0.5, 0.6, length(v_position.xy));
     // vec3 color = vec3(1.0, 1.0, 0.0) * inCircle;
     
     // CLEAR
     
     float inRect = rect(v_position.xy, vec2(1.0), vec2(0.0));
     vec3 color = vec3(1.0, 1.0, 0.0) * inRect;
     
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
  u_resolution: { value: { x: 0, y: 0 } },
  u_color: { value: new THREE.Color(0xff0000) },
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
  uniforms.u_resolution.value.x = window.innerWidth
  uniforms.u_resolution.value.y = window.innerHeight / 2
}

animate()
