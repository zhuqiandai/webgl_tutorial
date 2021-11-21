import * as THREE from 'three'
import './style.css'

function addGeometry(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  camera.position.z = 5

  return cube
}

function animate(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  cube: THREE.Mesh
) {
  requestAnimationFrame(() => {
    animate(renderer, scene, camera, cube)
  })

  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  renderer.render(scene, camera)
}

function main() {
  const scene = new THREE.Scene()

  /**
   * 透视相机和 webgl 中透视矩阵相同
   *
   * 1. 透视范围上下面夹角
   * 2. 近裁剪面 长宽比
   * 3. 近裁剪面距离
   * 4. 远裁剪面距离
   */
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  // antialias 抗锯齿
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)

  document.body.appendChild(renderer.domElement)

  const cube = addGeometry(scene, camera)

  animate(renderer, scene, camera, cube)
}

main()
