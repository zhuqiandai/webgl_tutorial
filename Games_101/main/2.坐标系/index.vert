            layout(location=0) in vec3 a_position;

            void main()
            {
              vec4 position = vec4(a_position, 1.0);

              gl_Position=position;
            }