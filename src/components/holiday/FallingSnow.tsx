import React, { useEffect, useState } from 'react';
import './FallingSnow.css';

interface Snowflake {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

const FallingSnow: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Generate snowflakes
    const newSnowflakes: Snowflake[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 8 + Math.random() * 4,
      size: 3 + Math.random() * 8,
      opacity: 0.6 + Math.random() * 0.4,
    }));
    setSnowflakes(newSnowflakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {snowflakes.map((snowflake) => (
        <div
          key={snowflake.id}
          className="falling-snow"
          style={{
            left: `${snowflake.left}%`,
            width: `${snowflake.size}px`,
            height: `${snowflake.size}px`,
            opacity: snowflake.opacity,
            animation: `fall ${snowflake.duration}s linear ${snowflake.delay}s infinite`,
            top: '-10px',
          }}
        />
      ))}
    </div>
  );
};

export default FallingSnow;
