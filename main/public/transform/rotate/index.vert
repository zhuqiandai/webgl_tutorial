attribute vec3 aPosition;

uniform mat3 uRotate;

void main(void){
    gl_Position= vec4(uRotate * aPosition.xyz, 1);
}
