#ifdef GL_ES
precision mediump float;
#endif

uniform float uLigIntensity;
uniform vec3 uLightRadiance;

void main(void) {

  gl_FragColor = vec4(uLightRadiance, 1.0);
}