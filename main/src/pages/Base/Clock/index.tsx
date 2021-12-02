import React, {useRef, useEffect} from 'react';

interface Props {
};

const draw = () => {}

export default function ClockElement(props: Props) {

  const canavsRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canavsRef.current) {
      const gl = canavsRef.current.getContext('webgl')

      if (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        draw()
      }
    }
  }, [])

  return (
      <div id="container">
        <canvas className="canvas-ref" ref={canavsRef}></canvas>
      </div>
  );
};
