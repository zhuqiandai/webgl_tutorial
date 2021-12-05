attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform vec3 uLightColor;
uniform vec3 uLightPosition;

varying vec3 vColor;

void main(void){

    mat4 mvpMatrix = uProjectionMatrix * uViewMatrix * uModelMatrix;

    vec4 position = mvpMatrix * vec4(aPosition.xyz, 1);

    vec3 direction = normalize(uLightPosition - position.xyz);

    vec3 light = max(dot(direction, normalize(aNormal)), 0.0) * uLightColor;

    gl_Position= position;

    vColor = light;
}
