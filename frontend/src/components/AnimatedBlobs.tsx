import React from 'react';

const AnimatedBlobs = () => {
  return (
    <span className="relative h-full w-full overflow-hidden ">
      <span
        className="wobbly rounded-full bg-main-purple absolute
         h-[40rem] w-[40rem] translate-x-[-70%] translate-y-[-70%] md:translate-x-[-62%] md:translate-y-[-62%] lg:translate-x-[-50%] lg:translate-y-[-50%] animate-wobble0 ease-wobble
           duration-4000"
      ></span>
      <span
        className="wobbly rounded-full bg-main-purple absolute
         h-[40rem] w-[40rem] bottom-0 right-0 animate-wobble1 translate-x-[70%] translate-y-[70%] md:translate-x-[62%] md:translate-y-[62%] lg:translate-x-[50%] lg:translate-y-[50%] ease-wobble
          duration-4000"
      ></span>
    </span>
  );
};

export default AnimatedBlobs;
