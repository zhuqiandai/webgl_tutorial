            layout(location=0) in vec3 a_position;

            uniform mat4 u_modelMatrix;

            void main()
            {
              vec4 position = vec4(a_position, 1.0);

              position = u_modelMatrix * position;

              gl_Position=position;
            }