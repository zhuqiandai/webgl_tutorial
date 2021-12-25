precision mediump float;

uniform sampler2D uSampler2D;

varying vec2 vTexCoord;

void main () {
    gl_FragColor = texture2D(uSampler2D, vec2(vTexCoord.s, vTexCoord.t));
}
