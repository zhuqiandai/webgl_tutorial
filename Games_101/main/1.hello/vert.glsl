layout(location=0) in vec3 a_position;
layout(location=1) in vec3 a_normal;

uniform mat4 u_model;
uniform mat4 u_projection;

out vec3 v_normal;
out vec3 v_eyeCoords;

void main()
{
    vec3 ambientLight = vec3(0.6, 0.6, 0.6);
    vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);
    vec3 directionalVector = vec3(0.85, 0.8, 0.75);

    v_normal = normalize(a_normal);

    vec4 eyeCoords = u_model * vec4(a_position, 1.);
    v_eyeCoords = eyeCoords.xyz / eyeCoords.w;

    vec4 position = u_projection * eyeCoords;
    gl_Position=position;
}