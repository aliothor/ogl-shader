import './assets/style.css'
import { Renderer, Program, Color, Mesh, Triangle, Vec3, Texture } from 'ogl'

const vertex = `
  attribute vec2 position;

  void main(){
      gl_Position=vec4(position,0,1);
  }
`

const fragment = `
  precision highp float;

  uniform vec3 uResolution;
  uniform float uTime;
   
  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
      // Normalized pixel coordinates (from 0 to 1)
      vec2 uv = fragCoord/uResolution.xy;
   
      // Time varying pixel color
      // vec3 col = 0.5 + 0.5*cos(uTime+uv.xyx+vec3(0,2,4));
      vec3 col = 0.5 + 0.5*cos(uTime+uv.xyx*40.0+vec3(0,2,4));
   
      // Output to screen
      fragColor = vec4(col,1.0);
  }
   
  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
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
        uResolution: { value: new Vec3() }
    }
})

const mesh = new Mesh(gl, { geometry, program })

const width = gl.canvas.width
const height = gl.canvas.height

function update(t: DOMHighResTimeStamp) {
    requestAnimationFrame(update)

    program.uniforms.uResolution.value = new Vec3(width, height, 1)
    program.uniforms.uTime.value = t * 0.001;

    renderer.render({ scene: mesh })
}

requestAnimationFrame(update)