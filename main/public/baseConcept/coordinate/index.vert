attribute vec3 aPosition;

uniform mat4 uViewMatrix;

void main () {
    vec3 transform_position;

    transform_position = mat3(uViewMatrix) * aPosition;

    gl_Position = vec4(transform_position.xyz, 1.0);
}
