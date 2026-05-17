'use client';

import { useEffect, useState, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  stepKey: string;
}

export default function AnimatedStep({ children, stepKey }: Props) {
  const [animate, setAnimate] = useState(false);
  const prevKey = useRef('');

  useEffect(() => {
    if (prevKey.current === stepKey) return;
    prevKey.current = stepKey;
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, [stepKey]);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div
      style={{
        opacity: animate ? 1 : 0,
        transform: animate ? 'translateY(0)' : 'translateY(15px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {children}
    </div>
  );
}
