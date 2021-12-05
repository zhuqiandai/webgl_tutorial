attribute vec3 aPosition;
attribute vec4 aColor;

attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec4 vColor;
varying vec3 vNormal;

void main(void){

    mat4 mvpMatrix = uProjectionMatrix * uViewMatrix * uModelMatrix;

    gl_Position= mvpMatrix * vec4(aPosition.xyz, 1);

    vColor = aColor;
    vNormal = mat3(mvpMatrix) * aNormal;
}
