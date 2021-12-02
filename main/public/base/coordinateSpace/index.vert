attribute vec3 aPosition;
attribute vec4 aColor;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec4 vColor;

void main(void){
    gl_Position= uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition.xyz, 1);

    vColor = aColor;
}
