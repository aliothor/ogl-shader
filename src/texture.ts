import './assets/style.css'
import { Renderer, Program, Color, Mesh, Triangle, Vec3, Texture, } from 'ogl'
// @ts-expect-error
import bayer from './assets/bayer.png'

const vertex = `
  attribute vec2 position;

  void main(){
      gl_Position=vec4(position,0,1);
  }
`

const fragment = `
  precision highp float;

  #define TIMESCALE 0.25
  #define TILES 8
  #define COLOR 0.7, 1.6, 2.8

  uniform vec3 uResolution;
  uniform float uTime;
  uniform sampler2D uChannel0;
   
  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
    vec2 uv = fragCoord.xy / uResolution.xy;
    uv.x *= uResolution.x / uResolution.y;
 
    vec4 noise = texture2D(uChannel0, floor(uv * float(TILES)) / float(TILES));
    float p = 1.0 - mod(noise.r + noise.g + noise.b + uTime * float(TIMESCALE), 1.0);
    p = min(max(p * 3.0 - 1.8, 0.1), 2.0);
 
    vec2 r = mod(uv * float(TILES), 1.0);
    r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
    p *= 1.0 - pow(min(1.0, 12.0 * dot(r, r)), 2.0);
 
    fragColor = vec4(COLOR, 1.0) * p;
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
gl.clearColor(1, 1, 1, 1)

function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight)
}
window.addEventListener('resize', resize, false)
resize()

const geometry = new Triangle(gl)

const texture = new Texture(gl)

const img = new Image();
img.src = bayer;
img.onload = () => (texture.image = img);

const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec3() },
        uChannel0: { value: texture }
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