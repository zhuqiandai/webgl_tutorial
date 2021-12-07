#ifdef GL_ES
precision mediump float;
#endif

varying vec4 vColor;

void main(void) {
    gl_FragColor = vec4(vColor.rgb, 0.2);
}
