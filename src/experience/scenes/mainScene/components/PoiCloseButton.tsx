'use client';
import { Button } from '@/components/ui/button';
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
 */
export function PoiCloseButton({ isVisible, onClick }: PoiCloseButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  console.log('[PoiCloseButton] Render:', { isVisible, hasRef: !!buttonRef.current });

  // GSAP animations
  useGSAP(
    () => {
      if (!buttonRef.current) {
        console.log('[PoiCloseButton] No buttonRef');
        return;
      }

      console.log('[PoiCloseButton] Animation triggered:', { isVisible });

      if (isVisible) {
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
            onComplete: () => console.log('[PoiCloseButton] Fade in complete'),
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
    { dependencies: [isVisible] }
  );

  if (!isVisible) return null;

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
