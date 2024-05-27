import './assets/style.css'
import { Renderer, Program, Color, Mesh, Triangle, Vec3 } from 'ogl'

const vertex = `
  attribute vec2 uv;
  attribute vec2 position;

  varying vec2 vUv;

  void main(){
      vUv=uv;
      gl_Position=vec4(position,0,1);
  }
`

const fragment = `
  precision highp float;

  uniform float uTime;
  uniform vec3 uColor;

  varying vec2 vUv;

  void main(){
    gl_FragColor.rgb=0.5+0.3*cos(vUv.xyx+uTime)+uColor;
    gl_FragColor.a=1.0;
  }
`

const renderer = new Renderer({
  canvas: document.getElementById('app') as any,
  width: 680,
  height: 680,
  webgl: 2
})
const gl = renderer.gl
// document.body.appendChild(gl.canvas)
gl.clearColor(1, 1, 1, 1)

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight)
}
window.addEventListener('resize', resize, false)
resize()

const geometry = new Triangle(gl)

const program = new Program(gl, {
  vertex,
  fragment,
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new Color(0.3, 0.2, 0.5) }
  }
})

const mesh = new Mesh(gl, { geometry, program })

function update(t: DOMHighResTimeStamp) {
  requestAnimationFrame(update)

  program.uniforms.uTime.value = t * 0.001;

  renderer.render({ scene: mesh })
}

requestAnimationFrame(update)