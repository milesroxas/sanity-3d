'use client';
import Blocks from '@/components/blocks';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface MarkerContentOverlayProps {
  title: string;
  isVisible: boolean;
  onClose: () => void;
  blocks?: Sanity.Block[];
}

export default function MarkerContentOverlay({
  title,
  isVisible,
  onClose,
  blocks,
}: MarkerContentOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [logoMarkerWidth, setLogoMarkerWidth] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const { isContentVisible: isLogoMarkerVisible } = useLogoMarkerStore();

  // Check if we're on mobile and calculate LogoMarkerContent width
  useEffect(() => {
    const checkMobileAndCalculateWidth = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      const logoMarkerContent = document.querySelector('[class*="fixed left-0 top-0 z-20"]');
      if (logoMarkerContent) {
        const width = logoMarkerContent.getBoundingClientRect().width;
        setLogoMarkerWidth(width);
      } else {
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
    if (!isLogoMarkerVisible && isVisible && !isAnimating) {
      handleClose(); // Use handleClose to trigger animation instead of onClose
    }
  }, [isLogoMarkerVisible, isVisible, isAnimating]);

  // Handle close animation
  const handleClose = () => {
    setIsAnimating(true);
    // Let the animation play, then call onClose after animation completes
  };

  // GSAP animations using useGSAP hook
  useGSAP(
    () => {
      if (!overlayRef.current) return;

      const shouldShow = isVisible && isLogoMarkerVisible && !isAnimating;
      const shouldHide = (!isVisible || !isLogoMarkerVisible) && !isAnimating;
      const shouldAnimate = isAnimating;

      if (shouldShow) {
        setIsAnimating(false);
        if (isMobile) {
          // Mobile: slide up animation
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
          // Desktop: fade in animation with timeline
          const tl = gsap.timeline();

          // Set initial states
          gsap.set(overlayRef.current, { opacity: 0, x: -200 });
          gsap.set(blocksRef.current, { opacity: 0, y: 20 });
          gsap.set(titleRef.current, { opacity: 0, x: -10 });
          gsap.set(closeRef.current, { opacity: 0 });
          gsap.set(contentRef.current, { opacity: 0, y: 20 });

          tl.to(overlayRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.in',
          })
            .to(
              overlayRef.current,
              {
                x: 0,
                duration: 0.8,
                ease: 'power2.inOut',
              },
              '-=0.4'
            )
            .to(
              titleRef.current,
              {
                opacity: 1,
                x: 0,
                duration: 0.3,
                ease: 'power2.inOut',
              },
              '-=0.2'
            )
            .to(
              contentRef.current,
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.inOut',
              },
              '-=0.15'
            )
            .to(
              blocksRef.current,
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.inOut',
              },
              '-=0.6'
            )
            .to(closeRef.current, {
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
            });
        }
      } else if (shouldAnimate) {
        // Handle close animation
        if (isMobile) {
          // Mobile: slide down animation
          gsap.to(overlayRef.current, {
            y: '100%',
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
              setIsAnimating(false);
              onClose();
            },
          });
        } else {
          // Desktop: fade out animation
          const tl = gsap.timeline({
            onComplete: () => {
              setIsAnimating(false);
              onClose();
            },
          });

          tl.to(blocksRef.current, {
            opacity: 0,
            duration: 0.2,
            ease: 'power2.in',
          })
            .to(titleRef.current, {
              opacity: 0,
              duration: 0.2,
              ease: 'power2.in',
            })
            .to(contentRef.current, {
              opacity: 0,
              duration: 0.2,
              ease: 'power2.in',
            })
            .to(overlayRef.current, {
              opacity: 0,
              x: -200,
              duration: 0.3,
              ease: 'power2.inOut',
            })
            .to(closeRef.current, {
              opacity: 0,
              duration: 0.3,
              ease: 'power2.in',
            });
        }
      }
    },
    { dependencies: [isVisible, isLogoMarkerVisible, isMobile, isAnimating] }
  );

  // Don't render if component should be completely hidden
  if ((!isVisible && !isAnimating) || !isLogoMarkerVisible) return null;

  const margin = 16;

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
            <h2 className="text-lg font-bold text-secondary" ref={titleRef}>
              {title}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-primary hover:bg-primary/10 [&_svg]:!size-5"
              ref={closeRef}
            >
              <X />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4" ref={contentRef}>
              {blocks && blocks.length > 0 ? (
                <div className="flex flex-col gap-4" ref={blocksRef}>
                  <Blocks blocks={blocks} />
                </div>
              ) : null}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  // Desktop layout: side-by-side with LogoMarkerContent
  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 flex"
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
            <h2 className="text-xl font-bold text-secondary" ref={titleRef}>
              {title}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-primary hover:bg-primary/10 [&_svg]:!size-6"
              ref={closeRef}
            >
              <X />
            </Button>
          </div>
          <ScrollArea className="flex-1 rounded-b-lg">
            <div className="px-6" ref={contentRef}>
              {blocks && blocks.length > 0 ? (
                <div className="flex flex-col gap-4" ref={blocksRef}>
                  <Blocks blocks={blocks} />
                </div>
              ) : null}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
