import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const Card3D = ({ children, className = '', intensity = 15 }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    setRotateY((mouseX / (rect.width / 2)) * intensity);
    setRotateX(-(mouseY / (rect.height / 2)) * intensity);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`card-3d ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: isHovered ? 'none' : 'transform 0.5s ease-out',
      }}
    >
      <div className="card-3d-shine" style={{
        opacity: isHovered ? 0.1 : 0,
        background: `radial-gradient(circle at ${50 + rotateY * 2}% ${50 - rotateX * 2}%, rgba(255,255,255,0.3), transparent)`,
      }} />
      {children}
    </motion.div>
  );
};

export default Card3D;
