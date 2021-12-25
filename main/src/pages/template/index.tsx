import {
  initBuffer,
  initShaderProgram,
  loadShaderFile,
} from '@mercator/gl-utils';
import { mat4 } from 'gl-matrix';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';

interface ProgramInfo {
  vertex: {
    aPosition: GLint;
    vTexCoord: GLint;
  };

  uniform: {
    uViewMatrix: WebGLUniformLocation | null;
    uSampler2D: WebGLUniformLocation | null;
  };
}

interface Buffers {
  verticesBuffer: WebGLBuffer;
  textureCoordsBuffer: WebGLBuffer;
}

interface Textures {
  texture: WebGLTexture | null;
}

const Template: FunctionComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gl, setGL] = useState<WebGLRenderingContext>();
  const [program, setProgram] = useState<WebGLProgram>();

  const vertices = [
    // Front face
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
  ];

  const textureCoords = [
    // Front
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Back
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Top
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Bottom
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Right
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Left
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  ];

  function draw(
    gl: WebGLRenderingContext,
    buffers: Buffers,
    textures: Textures,
    programInfo: ProgramInfo
  ) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const {
      vertex: { aPosition, vTexCoord },
      uniform: { uViewMatrix, uSampler2D },
    } = programInfo;

    const { verticesBuffer, textureCoordsBuffer } = buffers;
    const { texture } = textures;

    {
      // 分配顶点
      gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

      const location = aPosition;
      const size = 3;
      const type = gl.FLOAT;
      const normalized = false;
      const stride = 0;
      const offset = 0;

      gl.vertexAttribPointer(location, size, type, normalized, stride, offset);
      gl.enableVertexAttribArray(location);
    }

    {
      // 分配纹理坐标
      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordsBuffer);

      const location = vTexCoord;
      const size = 2;
      const type = gl.FLOAT;
      const normalized = false;
      const stride = 0;
      const offset = 0;

      gl.vertexAttribPointer(location, size, type, normalized, stride, offset);
      gl.enableVertexAttribArray(location);
    }

    {
      // 分配 viewMatrix
      const viewMatrix = mat4.create();
      mat4.scale(viewMatrix, viewMatrix, [0.5, 0.5, 0.5]);

      gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix);
    }

    {
      // 分配纹理
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uSampler2D, 0);
    }

    {
      const mode = gl.TRIANGLE_FAN;
      const first = 0;
      const count = 24;
      gl.drawArrays(mode, first, count);
    }
  }

  function render(
    gl: WebGLRenderingContext,
    buffers: Buffers,
    textures: Textures,
    programInfo: ProgramInfo
  ) {
    draw(gl, buffers, textures, programInfo);

    requestAnimationFrame(() => {
      render(gl, buffers, textures, programInfo);
    });
  }

  function buildTexture(gl: WebGLRenderingContext) {
    const texture = gl.createTexture();

    const image = new Image();
    image.src = 'textureMap/cubetexture.png';

    image.onload = () => {
      const target = gl.TEXTURE_2D;

      gl.bindTexture(target, texture);
      gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      // 设置了两种分配方案
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_NEAREST
      );

      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(target, texture);
    };

    return { texture };
  }

  function buildBuffer(gl: WebGLRenderingContext) {
    const verticesBuffer = initBuffer(
      gl,
      gl.ARRAY_BUFFER,
      new Float32Array(vertices)
    );

    const textureCoordsBuffer = initBuffer(
      gl,
      gl.ARRAY_BUFFER,
      new Float32Array(textureCoords)
    );

    return {
      verticesBuffer,
      textureCoordsBuffer,
    };
  }

  useEffect(() => {
    loadShaderFile('textureMap/index.vert')
      .then((vsSource: unknown) => {
        loadShaderFile('textureMap/index.frag')
          .then((fsSource: unknown) => {
            const gl = canvasRef.current?.getContext('webgl');
            const program = initShaderProgram(gl, vsSource, fsSource);

            if (gl && program) {
              setGL(gl);

              setProgram(program);
            }
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  }, []);

  useEffect(() => {
    if (gl && program) {
      gl.useProgram(program);

      const buffers = buildBuffer(gl);

      const textures = buildTexture(gl);

      const programInfo = {
        vertex: {
          aPosition: gl.getAttribLocation(program, 'aPosition'),
          vTexCoord: gl.getAttribLocation(program, 'aTexCoord'),
        },
        uniform: {
          uViewMatrix: gl.getUniformLocation(program, 'uViewMatrix'),
          uSampler2D: gl.getUniformLocation(program, 'uSampler2D'),
        },
      };

      requestAnimationFrame(() => {
        render(gl, buffers, textures, programInfo);
      });
    }
  }, [gl, program]);

  return (
    <>
      <canvas ref={canvasRef} width={800} height={800} className="canvas-ref" />
    </>
  );
};

export default Template;
