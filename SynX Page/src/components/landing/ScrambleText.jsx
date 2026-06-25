import React, { useEffect, useRef, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?<>{}[]';

export default function ScrambleText({ text, className = '', delay = 0, as: Tag = 'span' }) {
  const [displayText, setDisplayText] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) {
      setDisplayText(text.replace(/[^\s]/g, '_'));
      return;
    }

    let iteration = 0;
    const totalIterations = text.length * 3;

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, idx) => {
              if (char === ' ') return ' ';
              if (idx < iteration / 3) return char;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('')
        );

        iteration++;
        if (iteration > totalIterations) {
          setDisplayText(text);
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [hasStarted, text, delay]);

  return (
    <Tag ref={ref} className={className}>
      {displayText}
    </Tag>
  );
}
