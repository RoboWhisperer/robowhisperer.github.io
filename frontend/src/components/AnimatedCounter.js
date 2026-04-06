import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const numericEnd = parseInt(end.toString().replace(/[^0-9]/g, ''));
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(numericEnd * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(numericEnd);
      }
    };

    animate();
  }, [isInView, end, duration]);

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <span ref={ref} className="animated-counter">
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

export default AnimatedCounter;
