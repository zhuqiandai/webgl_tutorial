#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 uLightColor;

varying vec3 vNormal;
varying vec3 vLightDirection;
varying vec3 vCameraDirection;

void main(void) {

    vec3 light;

    // 环境光
    vec3 amibientLight = vec3(0.2, 0.2, 0.2) ;

    float directionLight = dot(vLightDirection, normalize(vNormal));

    // 漫反射
    vec3 dLight = max(directionLight, 0.0)* uLightColor;

    // 反射的方向
    vec3 reflectDirection = reflect(-vLightDirection, vNormal);
    float reflectDirectional = max(dot(normalize(reflectDirection), normalize(vCameraDirection)), 0.0);

    light = dLight;

    vec3 color = vec3(1.0, 1.0, 1.0);

    gl_FragColor = vec4(color * light, 1.0);

    gl_FragColor.rgb += pow(reflectDirectional, 128.0);
}
