import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = ({
  mousePosition,
}: {
  mousePosition: { x: number | null; y: number | null };
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context && mousePosition.x && mousePosition.y) {
        context.beginPath();
        context.moveTo(mousePosition.x - 100, mousePosition.y - 100);
        context.lineTo(mousePosition.x, mousePosition.y);
        context.stroke();
      }
    }
  }, [mousePosition]);
  console.log(mousePosition);
  return (
    <motion.canvas
      className="h-full w-screen -z-10 absolute top-0 left-0 bg-gray-700 "
      ref={canvasRef}
    ></motion.canvas>
  );
};

export default AnimatedBackground;
