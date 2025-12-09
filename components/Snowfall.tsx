import React, { useEffect, useState } from 'react';

const Snowfall: React.FC = () => {
  const [flakes, setFlakes] = useState<number[]>([]);

  useEffect(() => {
    // Generate a static number of flakes to render
    const count = 50;
    const newFlakes = Array.from({ length: count }, (_, i) => i);
    setFlakes(newFlakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {flakes.map((i) => {
        const left = Math.random() * 100;
        const duration = 5 + Math.random() * 10;
        const delay = Math.random() * 5;
        const size = 0.5 + Math.random() * 1; // rem
        
        return (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              fontSize: `${size}rem`,
            }}
          >
            ❄
          </div>
        );
      })}
    </div>
  );
};

export default Snowfall;