import { Scene, Engine } from 'babylonjs'

import mapboxGL, { Map as MBMap } from 'mapbox-gl'

mapboxGL.accessToken =
  'pk.eyJ1Ijoid2FuZ3poYW94dSIsImEiOiJja3I1eGVtZXowOGp5MnFscG0ya2ZlenRvIn0.tqCvhHKCTbrLMl4fITRm1A'

const canvas = document.getElementById('container')

if (canvas) {
  // param 2 抗锯齿
  const engine = new Engine(canvas as HTMLCanvasElement, true)
}
