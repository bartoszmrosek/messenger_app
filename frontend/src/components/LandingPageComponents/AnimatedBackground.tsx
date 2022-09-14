import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <motion.div
      className="h-full w-screen -z-10 absolute top-0 left-0"
      animate={{ backgroundColor: ['rgb(0,0,0)', 'rgb(125,125,125)'] }}
      transition={{ delay: 1 }}
    ></motion.div>
  );
};

export default AnimatedBackground;
