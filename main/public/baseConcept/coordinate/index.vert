attribute vec3 aPosition;

uniform mat4 uViewMatrix;

void main () {
    gl_Position = vec4(aPosition.xyz, 1.0);
}
