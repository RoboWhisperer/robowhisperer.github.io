import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useTheme } from '../context/ThemeContext';

const ParticleBackground = () => {
  const { isDark } = useTheme();
  const [init, setInit] = useState(false);

  const particlesInit = useCallback(async (engine) => {
    try {
      await loadSlim(engine);
      setInit(true);
    } catch (e) {
      console.log('Particles init error:', e);
    }
  }, []);

  const options = useMemo(() => ({
    fullScreen: { enable: false },
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    particles: {
      color: { value: isDark ? '#00E5FF' : '#0051FF' },
      links: {
        color: isDark ? '#0051FF' : '#00E5FF',
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.8,
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'out' },
      },
      number: {
        density: { enable: true, area: 1000 },
        value: 40,
      },
      opacity: { value: 0.4 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 2 } },
    },
    detectRetina: true,
  }), [isDark]);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={options}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ParticleBackground;
