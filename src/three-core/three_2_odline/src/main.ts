import * as THREE from 'three'
import './style.css'

function addOdLine() {
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 })

  const points = []
  points.push(new THREE.Vector3(-2, 0, -10))
  points.push(new THREE.Vector3(0, 10, -10))

  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  const line = new THREE.Line(geometry, material)

  return line
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

  const line = addOdLine()
  scene.add(line)

  camera.position.z = 5

  renderer.render(scene, camera)

  document.body.appendChild(renderer.domElement)
}

main()
