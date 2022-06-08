precision mediump float;

out vec4 fragColor;

uniform mat3 u_normalMatrix;

in vec3 v_normal;
in vec3 v_eyeCoords;

void main(void)
{
    vec3 N, L, R, V;

    vec4 lightPosition = vec4(0.0, 0.0, 0.0, 1.);
    vec4 diffuseColor = vec4(1.0, 0.0, 0.0, 1.);
    vec3 specularColor = vec3(1.0, 1.0, 1.0);
    float specularExponent = 30.0;

    N = normalize(u_normalMatrix * v_normal);
    L = normalize(lightPosition.xyz/lightPosition.w - v_eyeCoords);

    R = -reflect(, )(L,N);
    V = normalize( -v_eyeCoords); 

    vec3 color = 0.8 * dot(L,N) * diffuseColor.rgb;

    if (dot(R,V) > 0.0) {
      color += 0.4 * pow(dot(R,V),specularExponent) * specularColor;
    }

    fragColor=vec4(color, diffuseColor.a);
}