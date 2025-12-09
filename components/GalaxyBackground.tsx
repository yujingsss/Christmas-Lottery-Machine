import React, { useEffect, useState } from 'react';

const GalaxyBackground: React.FC = () => {
  const [stars, setStars] = useState<{id: number, top: string, left: string, size: string, opacity: number, delay: string}[]>([]);
  const [meteors, setMeteors] = useState<{id: number, top: string, left: string, delay: string}[]>([]);

  useEffect(() => {
    // Generate Stars
    const starCount = 100;
    const newStars = Array.from({ length: starCount }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3}px`,
      opacity: Math.random(),
      delay: `${Math.random() * 5}s`
    }));
    setStars(newStars);

    // Generate Meteors
    const meteorCount = 5;
    const newMeteors = Array.from({ length: meteorCount }, (_, i) => ({
      id: i,
      top: `${Math.random() * 50}%`,
      left: `${50 + Math.random() * 50}%`,
      delay: `${Math.random() * 10}s`
    }));
    setMeteors(newMeteors);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-b from-black via-[#090510] to-[#0a0000]">
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: star.delay
          }}
        />
      ))}
      
      {/* Meteors */}
      {meteors.map((meteor) => (
        <div 
          key={meteor.id}
          className="meteor"
          style={{
            top: meteor.top,
            left: meteor.left,
            animationDelay: meteor.delay,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

export default GalaxyBackground;