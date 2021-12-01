attribute vec3 aPosition;

uniform mat4 uMVPMatrix;

void main(void){
    gl_Position=uMVPMatrix*vec4(aPosition.xyz, 1.0);
}
