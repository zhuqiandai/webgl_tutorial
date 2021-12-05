#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 uLightDirection;
uniform vec3 uLightColor;

uniform vec3 uAmbientLight;

varying vec4 vColor;
varying vec3 vNormal;

void main(void) {
    float directional = max(dot(uLightDirection, vNormal), 0.0);

    vec3 ambientLight = uAmbientLight;

    vec3 light = directional * uLightColor;

    gl_FragColor = vec4(ambientLight + vColor.rgb * light.rgb, 1.0);
}
