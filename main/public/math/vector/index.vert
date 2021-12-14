attribute vec3 aPosition;
attribute vec3 aColor;

uniform mat4 uViewMatrix;

varying vec3 vColor;

void main () {
    vec3 transform_position;

    transform_position = mat3(uViewMatrix) * aPosition;

    gl_Position = vec4(transform_position.xyz, 1.0);

    vColor = aColor;
}
