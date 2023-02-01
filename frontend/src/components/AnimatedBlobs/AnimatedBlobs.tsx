import React, { useEffect } from 'react';

const AnimatedBlobs = () => {
  useEffect(() => {
    const wobblyInterval = setInterval(() => {
      const wobblyElems = document.querySelectorAll<HTMLElement>('.wobbly');
      let tl: number, tr: number, br: number, bl: number;
      const max = 200,
        min = 350;
      wobblyElems.forEach(elem => {
        tl = Math.floor(Math.random() * (max - min) + min);
        tr = Math.floor(Math.random() * (max - min) + min);
        br = Math.floor(Math.random() * (max - min) + min);
        bl = Math.floor(Math.random() * (max - min) + min);

        const borderRadius = `${tl}px ${tr}px ${br}px ${bl}px `;
        elem.style.borderRadius = borderRadius;
      });
    }, 5000);
    return () => {
      clearInterval(wobblyInterval);
    };
  });
  return (
    <span className="relative h-full w-full overflow-hidden ">
      <svg
        className="wobbly rounded-full bg-main-purple absolute
         h-[40rem] w-[40rem] translate-x-[-70%] translate-y-[-70%] md:translate-x-[-62%] md:translate-y-[-62%] lg:translate-x-[-50%] lg:translate-y-[-50%] animate-wobble0 ease-wobble
           duration-4000"
        role="img"
      >
        <title>Blob</title>
      </svg>
      <svg
        className="wobbly rounded-full bg-main-purple absolute
         h-[40rem] w-[40rem] bottom-0 right-0 animate-wobble1 translate-x-[70%] translate-y-[70%] md:translate-x-[62%] md:translate-y-[62%] lg:translate-x-[50%] lg:translate-y-[50%] ease-wobble
          duration-4000"
        role="img"
      >
        <title>Blob</title>
      </svg>
    </span>
  );
};

export default AnimatedBlobs;
