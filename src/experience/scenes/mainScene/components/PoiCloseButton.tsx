'use client';
import { Button } from '@/components/ui/button';
import { usePoiStore } from '@/experience/scenes/store/poiStore';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { X } from 'lucide-react';
import { useRef } from 'react';

interface PoiCloseButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

/**
 * PoiCloseButton - Close button for POI overlay mode
 *
 * Renders as a DOM element outside the R3F Canvas (like LogoMarkerContent).
 *
 * Features:
 * - X icon with semi-transparent black circular background
 * - GSAP animations for smooth entrance/exit
 * - Positioned in top-right corner
 * - Matches legacy marker content close button behavior
 * - Hides when POI content overlay is visible to avoid overlapping close buttons
 */
export function PoiCloseButton({ isVisible, onClick }: PoiCloseButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Hide this button when POI content overlay is visible
  const isPoiOverlayVisible = usePoiStore(s => s.isPoiOverlayVisible);
  const shouldShow = isVisible && !isPoiOverlayVisible;

  // GSAP animations
  useGSAP(
    () => {
      if (!buttonRef.current) {
        return;
      }

      if (shouldShow) {
        // Fade and scale in
        gsap.fromTo(
          buttonRef.current,
          {
            opacity: 0,
            scale: 0.8,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out',
            delay: 0.3, // Slight delay after POIs appear
          }
        );
      } else {
        // Fade and scale out
        gsap.to(buttonRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    },
    { dependencies: [shouldShow] }
  );

  if (!shouldShow) return null;

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="fixed right-4 top-4 z-[100] h-12 w-12 rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-gray-800/90 md:right-6 md:top-6"
      style={{ opacity: 0 }}
      aria-label="Close POI view and return to main experience"
    >
      <X className="h-6 w-6 text-white" />
    </Button>
  );
}
