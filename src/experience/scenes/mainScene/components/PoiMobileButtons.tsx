'use client';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { usePoiStore } from '@/experience/scenes/store/poiStore';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { stegaClean } from 'next-sanity';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * PoiMobileButtons - DOM-based POI button stack for mobile in interactive mode
 *
 * Replaces 3D-positioned PoiButton components on mobile.
 * Renders as a fixed bottom overlay with stacked buttons.
 */
export function PoiMobileButtons() {
  const selectedScene = useLogoMarkerStore(s => s.selectedScene);
  const poisVisible = usePoiStore(s => s.poisVisible);
  const selectedPoi = usePoiStore(s => s.selectedPoi);
  const setSelectedPoi = usePoiStore(s => s.setSelectedPoi);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, []);

  const inlinePois = useMemo(() => {
    if (!selectedScene?.pointsOfInterest) return [];
    return selectedScene.pointsOfInterest.filter(
      (poi): poi is Sanity.PointOfInterest =>
        poi._type === 'pointOfInterest' && !!poi.markerPosition
    );
  }, [selectedScene]);

  const isInteractiveMode = stegaClean(selectedScene?.poiDisplayMode) === 'interactive';

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const buttons = buttonRefs.current.filter(Boolean);

      if (poisVisible && !selectedPoi) {
        gsap.set(containerRef.current, { pointerEvents: 'auto' });
        gsap.to(containerRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' });
        gsap.fromTo(
          buttons,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.1, delay: 0.1 }
        );
      } else {
        gsap.set(containerRef.current, { pointerEvents: 'none' });
        gsap.to(containerRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in' });
      }
    },
    { dependencies: [poisVisible, selectedPoi] }
  );

  if (!isMobile || !isInteractiveMode || inlinePois.length === 0) return null;

  return createPortal(
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        opacity: 0,
        pointerEvents: 'none',
      }}
    >
      {inlinePois.map((poi, index) => (
        <button
          key={poi._key}
          ref={el => {
            buttonRefs.current[index] = el;
          }}
          onClick={() => setSelectedPoi(poi)}
          className="w-full max-w-sm rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.9)',
            opacity: 0,
          }}
        >
          {poi.title}
        </button>
      ))}
    </div>,
    document.body
  );
}
