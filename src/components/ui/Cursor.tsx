'use client';

import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  // Decide if the environment supports a fine, hoverable pointer (i.e., not mobile/touch)
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasFinePointer =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    setEnabled(!isTouchDevice && hasFinePointer);
  }, []);

  // When enabled, wire up animations and listeners
  useEffect(() => {
    if (!enabled) return;

    const cursor = cursorRef.current;
    const cursorOuter = cursorOuterRef.current;
    if (!cursor || !cursorOuter) return;

    // Hide the native cursor globally while custom cursor is active
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-custom-cursor', 'true');
    styleEl.textContent = `html, body, * { cursor: none !important; }`;
    document.head.appendChild(styleEl);

    // Initially hide cursors
    gsap.set([cursor, cursorOuter], { opacity: 0 });

    // Create quickTo animations for both cursors
    const cursorX = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power2.out' });
    const cursorY = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power2.out' });
    const cursorOuterX = gsap.quickTo(cursorOuter, 'x', { duration: 0.3, ease: 'power2.out' });
    const cursorOuterY = gsap.quickTo(cursorOuter, 'y', { duration: 0.3, ease: 'power2.out' });

    // Mouse move handler
    const onMouseMove = (e: MouseEvent) => {
      // Show cursors on first mouse movement
      gsap.to([cursor, cursorOuter], {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });

      cursorX(e.clientX);
      cursorY(e.clientY);
      cursorOuterX(e.clientX);
      cursorOuterY(e.clientY);
    };

    // Mouse leave handler (when cursor goes off-screen)
    const onMouseLeave = () => {
      gsap.to([cursor, cursorOuter], {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    // Mouse enter handler (when cursor returns to screen)
    const onMouseEnter = () => {
      gsap.to([cursor, cursorOuter], {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    // Add hover effect for interactive elements
    const onInteractiveEnter = () => {
      gsap.to([cursor, cursorOuter], {
        scale: 1.5,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    const onInteractiveLeave = () => {
      gsap.to([cursor, cursorOuter], {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    // Add event listeners
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Add cursor: none to all interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, select, textarea'
    );
    interactiveElements.forEach(el => {
      (el as HTMLElement).style.cursor = 'none';
      el.addEventListener('mouseenter', onInteractiveEnter);
      el.addEventListener('mouseleave', onInteractiveLeave);
    });

    // Cleanup
    return () => {
      // Restore native cursor
      if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);

      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      interactiveElements.forEach(el => {
        (el as HTMLElement).style.cursor = '';
        el.removeEventListener('mouseenter', onInteractiveEnter);
        el.removeEventListener('mouseleave', onInteractiveLeave);
      });
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor pointer-events-none fixed left-0 top-0 z-50 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference transition-transform duration-200 ease-out"
      />
      <div
        ref={cursorOuterRef}
        className="custom-cursor-outer pointer-events-none fixed left-0 top-0 z-50 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white mix-blend-difference transition-transform duration-200 ease-out"
      />
    </>
  );
};
