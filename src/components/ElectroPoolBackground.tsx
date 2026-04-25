import { useEffect, useRef } from 'react'

const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
  precision mediump float;
  uniform float  u_time;
  uniform vec2   u_res;
  uniform vec2   u_mouse;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
               mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p){
    float v=0.,a=0.5;
    for(int i=0;i<3;i++){v+=a*noise(p);p*=2.1;a*=0.5;}
    return v;
  }

  void main(){
    vec2 uv  = gl_FragCoord.xy / u_res;
    vec2 p   = uv * 2.0 - 1.0;
    p.x     *= u_res.x / u_res.y;
    float t  = u_time * 0.10;

    float n1 = fbm(p * 1.4 + vec2(t*0.25, t*0.18));
    float n2 = fbm(p * 2.2 - vec2(t*0.12, t*0.22) + n1*0.55);
    float n3 = fbm(p * 0.8 + vec2(t*0.08, -t*0.14) + n2*0.4);

    /* dark purple palette */
    vec3 c0 = vec3(0.018, 0.008, 0.038);   /* near black     */
    vec3 c1 = vec3(0.055, 0.018, 0.110);   /* deep purple    */
    vec3 c2 = vec3(0.130, 0.045, 0.260);   /* mid purple     */
    vec3 c3 = vec3(0.220, 0.070, 0.420);   /* bright purple  */

    vec3 col = mix(c0, c1, n3);
    col = mix(col, c2, n1 * n2 * 0.8);
    col = mix(col, c3, pow(n2 * n1, 2.0) * 0.5);

    /* mouse proximity glow */
    vec2 mUV = u_mouse / u_res;
    vec2 mP  = mUV * 2.0 - 1.0;
    mP.x    *= u_res.x / u_res.y;
    float md = length(p - mP);
    col += vec3(0.06, 0.012, 0.14) * (1.0/(md*5.0+1.8));

    /* subtle horizontal line flare */
    float lineY = sin(t * 2.5) * 0.5;
    float lineDist = abs(p.y - lineY);
    col += vec3(0.03, 0.005, 0.07) * (1.0/(lineDist*30.0+1.0));

    /* vignette */
    float vig = length(uv - 0.5);
    col *= 1.0 - vig * 1.35;

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function ElectroPoolBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null
    if (!gl) return

    // compile
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW)
    const posLoc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const uTime  = gl.getUniformLocation(prog, 'u_time')
    const uRes   = gl.getUniformLocation(prog, 'u_res')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
    window.addEventListener('mousemove', onMove)

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const start = Date.now()
    let rafId: number
    const render = () => {
      const t = (Date.now() - start) / 1000
      gl.uniform1f(uTime, t)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform2f(uMouse, mouse.x, canvas.height - mouse.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      rafId = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
