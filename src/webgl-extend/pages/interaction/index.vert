attribute vec4 aPosition;

uniform mat4 uMVPMatrix;

void main(void){
  gl_Position=uMVPMatrix*aPosition;
}