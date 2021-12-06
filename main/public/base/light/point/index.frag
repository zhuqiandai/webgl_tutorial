#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 uLightColor;
uniform vec3 uLightPosition;

varying vec3 vColor;

void main(void) {
    gl_FragColor = vec4(vColor.rgb, 1.0);
}
