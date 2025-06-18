'use client';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import gsap from 'gsap';
import { X } from 'lucide-react';
import { PortableTextBlock } from 'next-sanity';
import { useEffect, useRef, useState } from 'react';

interface MarkerContentOverlayProps {
  title: string;
  content: PortableTextBlock[];
  isVisible: boolean;
  onClose: () => void;
}

export default function MarkerContentOverlay({
  title,
  content,
  isVisible,
  onClose,
}: MarkerContentOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [logoMarkerWidth, setLogoMarkerWidth] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { isContentVisible: isLogoMarkerVisible } = useLogoMarkerStore();

  // Check if we're on mobile and calculate LogoMarkerContent width
  useEffect(() => {
    const checkMobileAndCalculateWidth = () => {
      // Check if we're on mobile (viewport width < 768px)
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Find the LogoMarkerContent element
      const logoMarkerContent = document.querySelector('[class*="fixed left-0 top-0 z-20"]');
      if (logoMarkerContent) {
        const width = logoMarkerContent.getBoundingClientRect().width;
        setLogoMarkerWidth(width);
      } else {
        // Fallback to a reasonable default if element not found
        setLogoMarkerWidth(Math.min(480, window.innerWidth * 0.33));
      }
    };

    checkMobileAndCalculateWidth();
    window.addEventListener('resize', checkMobileAndCalculateWidth);

    return () => {
      window.removeEventListener('resize', checkMobileAndCalculateWidth);
    };
  }, [isVisible]);

  // Close expanded content if logo marker is closed
  useEffect(() => {
    if (!isLogoMarkerVisible && isVisible) {
      onClose();
    }
  }, [isLogoMarkerVisible, isVisible, onClose]);

  // Animation effect
  useEffect(() => {
    if (!overlayRef.current) return;

    if (isVisible && isLogoMarkerVisible) {
      if (isMobile) {
        // For mobile: slide up animation
        gsap.fromTo(
          overlayRef.current,
          { y: '100%' },
          {
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
          }
        );
      } else {
        // For desktop: fade in animation
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
          }
        );
      }
    } else {
      if (isMobile) {
        // For mobile: slide down animation
        gsap.to(overlayRef.current, {
          y: '100%',
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        });
      } else {
        // For desktop: fade out animation
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    }
  }, [isVisible, isLogoMarkerVisible, isMobile]);

  // Don't render if either overlay shouldn't be visible or logo marker is closed
  if (!isVisible || !isLogoMarkerVisible) return null;

  const margin = 16; // Margin size in pixels

  // Mobile layout: full screen overlay with slide-up animation
  if (isMobile) {
    return (
      <div className="pointer-events-none fixed inset-0 z-40">
        <div
          ref={overlayRef}
          className="pointer-events-auto absolute inset-0 flex flex-col bg-background"
          style={{
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '1rem',
          }}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between bg-background/95 p-4 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-secondary">{title}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-primary hover:bg-primary/10 [&_svg]:!size-5"
            >
              <X />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4">
              <PortableTextRenderer value={content} variant="drawer" />
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  // Desktop layout: side-by-side with LogoMarkerContent
  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 flex"
      style={{
        paddingLeft: `${logoMarkerWidth + margin}px`,
        paddingRight: `${margin}px`,
        paddingTop: `${margin}px`,
        paddingBottom: `${margin}px`,
      }}
    >
      <div className="flex flex-1 items-center justify-center">
        <div
          ref={overlayRef}
          className="pointer-events-auto flex h-full max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-background shadow-xl"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-lg bg-background/95 p-6 pb-4 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-secondary">{title}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-primary hover:bg-primary/10 [&_svg]:!size-6"
            >
              <X />
            </Button>
          </div>
          <ScrollArea className="flex-1 rounded-b-lg">
            <div className="p-6 pt-2">
              <PortableTextRenderer value={content} variant="drawer" />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
