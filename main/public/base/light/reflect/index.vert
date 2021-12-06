attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform vec3 uCameraPosition;
uniform vec3 uLightPosition;

varying vec3 vNormal;
varying vec3 vLightDirection;
varying vec3 vCameraDirection;

void main(void){

    mat4 mvpMatrix = uProjectionMatrix * uViewMatrix * uModelMatrix;
    vec4 position = mvpMatrix * vec4(aPosition.xyz, 1);
    vec3 direction = normalize(uLightPosition - position.xyz);

    vec3 normal = mat3(mvpMatrix) * aNormal;

    vec3 cameraDirection = mat3(mvpMatrix) * normalize(position.xyz - uCameraPosition);

    gl_Position= position;

    vNormal = normal;
    vLightDirection = direction;
    vCameraDirection = cameraDirection;
}
