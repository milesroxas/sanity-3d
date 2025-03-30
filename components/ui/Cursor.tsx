'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorOuterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorOuter = cursorOuterRef.current;

    if (!cursor || !cursorOuter) return;

    // Create quickTo animations for both cursors
    const cursorX = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power2.out' });
    const cursorY = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power2.out' });
    const cursorOuterX = gsap.quickTo(cursorOuter, 'x', { duration: 0.3, ease: 'power2.out' });
    const cursorOuterY = gsap.quickTo(cursorOuter, 'y', { duration: 0.3, ease: 'power2.out' });

    // Mouse move handler
    const onMouseMove = (e: MouseEvent) => {
      cursorX(e.clientX);
      cursorY(e.clientY);
      cursorOuterX(e.clientX);
      cursorOuterY(e.clientY);
    };

    // Add hover effect for interactive elements
    const onMouseEnter = () => {
      gsap.to([cursor, cursorOuter], {
        scale: 1.5,
        duration: 0.2,
        ease: 'power2.out'
      });
    };

    const onMouseLeave = () => {
      gsap.to([cursor, cursorOuter], {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out'
      });
    };

    // Add event listeners
    window.addEventListener('mousemove', onMouseMove);
    
    // Add cursor: none to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
    interactiveElements.forEach(el => {
      (el as HTMLElement).style.cursor = 'none';
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactiveElements.forEach(el => {
        (el as HTMLElement).style.cursor = '';
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-50 w-2 h-2 bg-white rounded-full mix-blend-difference transition-transform duration-200 ease-out -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={cursorOuterRef}
        className="fixed pointer-events-none z-50 w-8 h-8 border-2 border-white rounded-full mix-blend-difference transition-transform duration-200 ease-out -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
};
