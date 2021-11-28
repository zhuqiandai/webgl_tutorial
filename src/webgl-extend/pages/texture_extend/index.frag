#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uSampler;

varying vec2 vTexCoord;

void main(void){
  gl_FragColor=texture2D(uSampler, vTexCoord);
}