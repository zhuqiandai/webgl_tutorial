attribute vec3 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uViewMatrix;

varying vec2 vTexCoord;

void main () {
    vec3 transform_position;

    transform_position = mat3(uViewMatrix) * aPosition;

    gl_Position = vec4(transform_position.xyz, 1.0);

    vTexCoord = aTexCoord;
}
