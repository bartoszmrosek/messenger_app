import React from 'react';
import AnimatedBackground from '../components/LandingPageComponents/AnimatedBackground';

const LandingPage = ({
  mousePosition,
}: {
  mousePosition: { x: number | null; y: number | null };
}) => {
  return <AnimatedBackground mousePosition={mousePosition} />;
};

export default LandingPage;
