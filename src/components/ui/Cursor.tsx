'use client';

import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCursorStore } from './cursorStore';

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  // Decide if the environment supports a fine, hoverable pointer (i.e., not mobile/touch)
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasFinePointer =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    setEnabled(!isTouchDevice && hasFinePointer);
  }, []);

  // Create a top-level portal container so the cursor sits above all layers
  useEffect(() => {
    const el = document.createElement('div');
    el.setAttribute('data-custom-cursor-root', '');
    Object.assign(el.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '2147483647',
    } as CSSStyleDeclaration);
    document.body.appendChild(el);
    setPortalEl(el);
    return () => {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    };
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

    // Mouse down/up handlers for tangible click feedback
    const onMouseDown = (e: MouseEvent) => {
      // Ensure cursors are visible and positioned at click
      gsap.to([cursor, cursorOuter], { opacity: 1, duration: 0.15, ease: 'power2.out' });
      cursorX(e.clientX);
      cursorY(e.clientY);
      cursorOuterX(e.clientX);
      cursorOuterY(e.clientY);

      // Press feedback: quick compress on inner and pop on outer
      gsap.to(cursor, { scale: '-=0.25', duration: 0.08, ease: 'power3.out' });
      gsap.to(cursorOuter, { scale: '+=0.35', duration: 0.12, ease: 'power3.out' });

      // Minimal ripple ring (subtle)
      const ripple = document.createElement('div');
      ripple.className = 'pointer-events-none fixed left-0 top-0 rounded-full mix-blend-difference';
      Object.assign(ripple.style, {
        border: '1px solid rgba(255,255,255,0.9)',
        width: '10px',
        height: '10px',
        zIndex: '2147483647',
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        transform: 'translate(-50%, -50%) scale(0)',
        transformOrigin: 'center',
        opacity: '0.4',
      } as CSSStyleDeclaration);
      (portalEl || document.body).appendChild(ripple);
      gsap.to(ripple, {
        scale: 1.8,
        opacity: 0,
        duration: 0.35,
        ease: 'power3.out',
        onComplete: () => ripple.remove(),
      });
    };

    const onMouseUp = () => {
      // Release feedback: bounce back towards current state
      gsap.to(cursor, { scale: '+=0.25', duration: 0.2, ease: 'power3.out' });
      gsap.to(cursorOuter, { scale: '-=0.35', duration: 0.25, ease: 'power3.out' });
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
      useCursorStore.getState().setHoveringInteractive(true);
    };

    const onInteractiveLeave = () => {
      useCursorStore.getState().setHoveringInteractive(false);
    };

    // Add event listeners
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Add cursor: none to all interactive elements present now
    const interactiveSelector = 'a, button, [role="button"], input, select, textarea';
    const interactiveElements = document.querySelectorAll(interactiveSelector);
    interactiveElements.forEach(el => {
      (el as HTMLElement).style.cursor = 'none';
      el.addEventListener('mouseenter', onInteractiveEnter);
      el.addEventListener('mouseleave', onInteractiveLeave);
    });

    // Event delegation to support dynamically added elements
    const delegatedMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest && target.closest(interactiveSelector)) {
        onInteractiveEnter();
      }
    };
    const delegatedMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest && target.closest(interactiveSelector)) {
        onInteractiveLeave();
      }
    };
    document.addEventListener('mouseover', delegatedMouseOver);
    document.addEventListener('mouseout', delegatedMouseOut);

    // Cleanup
    return () => {
      // Restore native cursor
      if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);

      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      interactiveElements.forEach(el => {
        (el as HTMLElement).style.cursor = '';
        el.removeEventListener('mouseenter', onInteractiveEnter);
        el.removeEventListener('mouseleave', onInteractiveLeave);
      });
      document.removeEventListener('mouseover', delegatedMouseOver);
      document.removeEventListener('mouseout', delegatedMouseOut);
    };
  }, [enabled, portalEl]);

  // Animate to an "interactive" variant when hovering interactive targets (from 3D or DOM)
  const hoveringInteractive = useCursorStore(s => s.hoveringInteractive);
  useEffect(() => {
    if (!enabled) return;
    const cursor = cursorRef.current;
    const cursorOuter = cursorOuterRef.current;
    if (!cursor || !cursorOuter) return;

    if (hoveringInteractive) {
      gsap.to(cursor, { scale: 0.92, duration: 0.12, ease: 'power3.out' });
      gsap.to(cursorOuter, {
        scale: 1.28,
        borderColor: 'rgba(255,255,255,0.95)',
        duration: 0.16,
        ease: 'power3.out',
      });
    } else {
      gsap.to(cursor, { scale: 1, duration: 0.16, ease: 'power3.out' });
      gsap.to(cursorOuter, {
        scale: 1,
        borderColor: 'rgba(255,255,255,1)',
        duration: 0.2,
        ease: 'power3.out',
      });
    }
  }, [hoveringInteractive, enabled]);

  if (!enabled) return null;

  const content = (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor pointer-events-none fixed left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference transition-transform duration-200 ease-out"
      />
      <div
        ref={cursorOuterRef}
        className="custom-cursor-outer pointer-events-none fixed left-0 top-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white mix-blend-difference transition-transform duration-200 ease-out"
      />
    </>
  );

  return portalEl ? createPortal(content, portalEl) : content;
};
