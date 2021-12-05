#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 uLightDirection;
uniform vec3 uLightColor;

uniform vec3 uAmbientLight;

varying vec4 vColor;
varying vec3 vNormal;

void main(void) {
    float directional = max(dot(normalize(uLightDirection), normalize(vNormal)), 0.0);

    vec3 light;

    if (directional == 0.0) {
        light = vec3(1.0, .0, .0);
    }

    vec3 ambientLight = uAmbientLight;

    light = directional * uLightColor;

    gl_FragColor = vec4(ambientLight + vColor.rgb * light.rgb, 1.0);
}
