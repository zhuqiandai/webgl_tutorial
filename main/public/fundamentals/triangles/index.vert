attribute vec3 aPosition;

void main(void){
    gl_Position=vec4(aPosition.xyz, 1.0);
}
