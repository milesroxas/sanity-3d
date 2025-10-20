// Cursor.tsx
'use client';

import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCursorStore } from './cursorStore';

type CursorMode = 'default' | 'scroll';

export const CustomCursor = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const scrollSvgRef = useRef<SVGSVGElement>(null);

  const [enabled, setEnabled] = useState(false);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  const mode = useCursorStore(s => s.mode as CursorMode);
  const hoveringInteractive = useCursorStore(s => s.hoveringInteractive);

  const modeRef = useRef<CursorMode>(mode);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Detect non-touch environment
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasFinePointer =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setEnabled(!isTouchDevice && hasFinePointer);
  }, []);

  // Create top-level cursor portal
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
    return () => el.remove();
  }, []);

  // Inject CSS for scroll arrows (high-contrast & legible on any bg)
  useEffect(() => {
    if (!enabled) return;
    const css = `
      [data-custom-cursor-root] .custom-cursor-outer { isolation:isolate; } /* prevent parent blends leaking in */

      [data-custom-cursor-root] .cursor-scroll-svg {
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        width:18px;
        height:28px;
        opacity:0;
        display:none;
        pointer-events:none;
        mix-blend-mode: normal; /* ensure pure color, not difference */
        will-change: opacity, transform, filter;
      }

      /* Solid fill with a dark keyline + drop shadow for readability */
      .cursor-scroll-svg .arrow {
        fill: hsl(142 76% 36%);
        stroke: rgba(0,0,0,.55);
        stroke-width: 3px;
        paint-order: stroke fill;
        opacity: 1;
        filter:
          drop-shadow(0 1px 1px rgba(0,0,0,.35))
          drop-shadow(0 0 2px rgba(0,0,0,.25));
      }

      @keyframes nudgeUp {
        0%,100% { transform:translateY(2px); opacity:.9; }
        50% { transform:translateY(-2px); opacity:1; }
      }
      @keyframes nudgeDown {
        0%,100% { transform:translateY(-2px); opacity:.9; }
        50% { transform:translateY(2px); opacity:1; }
      }
      .cursor-scroll-svg .up { animation:nudgeUp 1.1s ease-in-out infinite; }
      .cursor-scroll-svg .down { animation:nudgeDown 1.1s ease-in-out infinite; animation-delay:.55s; }

      @media (prefers-reduced-motion: reduce) {
        .cursor-scroll-svg .up, .cursor-scroll-svg .down { animation:none; }
      }
    `;
    const style = document.createElement('style');
    style.setAttribute('data-custom-cursor-css', 'scroll');
    style.textContent = css;
    document.head.appendChild(style);
    return () => style.remove();
  }, [enabled]);

  // Cursor movement + listeners
  useEffect(() => {
    if (!enabled) return;
    const dot = cursorDotRef.current;
    const outer = cursorOuterRef.current;
    if (!dot || !outer) return;

    const styleEl = document.createElement('style');
    styleEl.textContent = `html, body, * { cursor: none !important; }`;
    document.head.appendChild(styleEl);

    gsap.set([dot, outer], { opacity: 0 });

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power2.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power2.out' });
    const outerX = gsap.quickTo(outer, 'x', { duration: 0.3, ease: 'power2.out' });
    const outerY = gsap.quickTo(outer, 'y', { duration: 0.3, ease: 'power2.out' });

    const onMouseMove = (e: MouseEvent) => {
      // Store current mouse position
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Ring always follows
      outerX(e.clientX);
      outerY(e.clientY);

      // Freeze dot while in scroll mode (lets it fade out where it is)
      if (modeRef.current !== 'scroll') {
        dotX(e.clientX);
        dotY(e.clientY);
      }

      // Ensure visible on first move
      gsap.to([dot, outer], { opacity: 1, duration: 0.25, ease: 'power2.out' });
    };

    const onMouseDown = () => {
      if (modeRef.current !== 'scroll') {
        gsap.to(dot, { scale: 0.75, duration: 0.08, ease: 'power3.out' });
      }
      gsap.to(outer, { scale: 1.3, duration: 0.12, ease: 'power3.out' });
    };
    const onMouseUp = () => {
      if (modeRef.current !== 'scroll') {
        gsap.to(dot, { scale: 1, duration: 0.2, ease: 'power3.out' });
      }
      gsap.to(outer, { scale: 1, duration: 0.25, ease: 'power3.out' });
    };

    const onMouseLeave = () => {
      gsap.to([dot, outer], { opacity: 0, duration: 0.25, ease: 'power2.out' });
    };
    const onMouseEnter = () => {
      gsap.to([dot, outer], { opacity: 1, duration: 0.25, ease: 'power2.out' });
    };

    // Interactive hover delegation
    const onInteractiveEnter = () => useCursorStore.getState().setHoveringInteractive(true);
    const onInteractiveLeave = () => useCursorStore.getState().setHoveringInteractive(false);
    const interactiveSelector = 'a, button, [role="button"], input, select, textarea';
    const delegatedMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(interactiveSelector)) onInteractiveEnter();
    };
    const delegatedMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(interactiveSelector)) onInteractiveLeave();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover', delegatedMouseOver);
    document.addEventListener('mouseout', delegatedMouseOut);

    return () => {
      styleEl.remove();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', delegatedMouseOver);
      document.removeEventListener('mouseout', delegatedMouseOut);
    };
  }, [enabled]);

  // Hover scale (non-scroll)
  useEffect(() => {
    if (!enabled) return;
    const dot = cursorDotRef.current;
    const outer = cursorOuterRef.current;
    if (!dot || !outer) return;

    if (hoveringInteractive && mode !== 'scroll') {
      gsap.to(dot, { scale: 0.92, duration: 0.12, ease: 'power3.out' });
      gsap.to(outer, {
        scale: 1.28,
        borderColor: 'rgba(255,255,255,0.95)',
        duration: 0.16,
        ease: 'power3.out',
      });
    } else if (!hoveringInteractive && mode !== 'scroll') {
      gsap.to(dot, { scale: 1, duration: 0.16, ease: 'power3.out' });
      gsap.to(outer, {
        scale: 1,
        borderColor: 'rgba(255,255,255,1)',
        duration: 0.2,
        ease: 'power3.out',
      });
    }
  }, [hoveringInteractive, enabled, mode]);

  // Mode transitions
  useEffect(() => {
    if (!enabled) return;
    const dot = cursorDotRef.current;
    const outer = cursorOuterRef.current;
    const svg = scrollSvgRef.current;
    if (!dot || !outer || !svg) return;

    gsap.killTweensOf(dot);
    gsap.killTweensOf(svg);

    if (mode === 'scroll') {
      // Fade dot out smoothly where it is
      gsap.to(dot, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(dot, { display: 'none' });
        },
      });

      // Bring in arrows slightly scaled for extra presence
      gsap.set(svg, { display: 'block', scale: 0.92 });
      gsap
        .timeline({ defaults: { ease: 'power2.out' } })
        .to(svg, { opacity: 1, duration: 0.28, delay: 0.05 }, 0)
        .to(svg, { scale: 1, duration: 0.24 }, 0);
    } else {
      // Hide arrows
      gsap.to(svg, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(svg, { display: 'none', scale: 1 });
        },
      });

      // Put dot exactly at current mouse position to avoid "jump"
      // Use stored mouse position to ensure proper recalculation
      gsap.set(dot, { x: mousePos.current.x, y: mousePos.current.y, display: 'block' });
      gsap.to(dot, { opacity: 1, duration: 0.22, ease: 'power2.out', delay: 0.02 });
    }
  }, [mode, enabled]);

  if (!enabled) return null;

  const content = (
    <>
      {/* Inner dot */}
      <div
        ref={cursorDotRef}
        className="custom-cursor-dot will-change-opacity pointer-events-none fixed left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference will-change-transform"
      />

      {/* Outer ring (difference blend), arrows render inside with normal blend + outlines */}
      <div
        ref={cursorOuterRef}
        className="custom-cursor-outer pointer-events-none fixed left-0 top-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary mix-blend-difference will-change-transform"
      >
        <svg
          ref={scrollSvgRef}
          className="cursor-scroll-svg"
          viewBox="0 0 20 32"
          aria-hidden="true"
        >
          <polygon className="arrow up" points="5,14 10,9 15,14 10,11" />
          <polygon className="arrow down" points="5,18 10,23 15,18 10,21" />
        </svg>
      </div>
    </>
  );

  return portalEl ? createPortal(content, portalEl) : content;
};

export default CustomCursor;
