import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseEnterInteractive = () => setIsHovering(true);
    const onMouseLeaveInteractive = () => setIsHovering(false);

    const animate = () => {
      
      cursorX += (mouseX - cursorX) * 0.08;
      cursorY += (mouseY - cursorY) * 0.08;
      cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px) scale(${isHovering ? 1.8 : 1})`;

      
      dotX += (mouseX - dotX) * 0.25;
      dotY += (mouseY - dotY) * 0.25;
      dot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);

    
    const interactives = document.querySelectorAll('a, button, input, textarea, [data-cursor-hover]');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnterInteractive);
      el.addEventListener('mouseleave', onMouseLeaveInteractive);
    });

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationId);
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };
  }, [isHovering]);

  
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const interactives = document.querySelectorAll('a, button, input, textarea, [data-cursor-hover]');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-[#6D5DF6] pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{ transition: 'width 0.3s, height 0.3s, border-color 0.3s' }}
      />
      {}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      />
    </>
  );
}
