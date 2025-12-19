'use client';
import Blocks from '@/components/blocks';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useOverlayScrollLock } from '@/hooks/useOverlayScrollLock';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CheckCircle2, RotateCcw, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface FormOverlayProps {
  title: string;
  isVisible: boolean;
  onClose: () => void;
  blocks?: Sanity.Block[];
  hasSubmitted?: boolean;
  onSubmitAnother?: () => void;
}

/**
 * FormOverlay - Displays form content stacked on top of POI overlay
 *
 * Features:
 * - Slides in from right (matching POI overlay direction)
 * - Slightly narrower than POI overlay (90% width vs 100%)
 * - Right-aligned with POI overlay, showing POI on the left
 * - Drop shadow for stacked effect
 */
export default function FormOverlay({
  title,
  isVisible,
  onClose,
  blocks,
  hasSubmitted = false,
  onSubmitAnother,
}: FormOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Handle close animation
  const handleClose = () => {
    setIsAnimating(true);
  };

  // Handle escape key to close overlay
  useEscapeKey({
    enabled: isVisible,
    condition: !isAnimating,
    priority: 3, // Higher priority than POI overlay
    onEscape: handleClose,
  });

  // GSAP animations
  useGSAP(
    () => {
      if (!overlayRef.current) return;

      const shouldShow = isVisible && !isAnimating;
      const shouldAnimate = isAnimating;

      if (shouldShow) {
        setIsAnimating(false);

        if (isMobile) {
          // Mobile: slide up animation
          gsap.set(overlayRef.current, { y: '100%', x: 0, opacity: 0 });
          gsap.set(titleRef.current, { opacity: 0, y: 10 });
          gsap.set(contentRef.current, { opacity: 0, y: 20 });
          gsap.set(blocksRef.current, { opacity: 0, y: 20 });
          gsap.set(closeRef.current, { opacity: 0 });

          gsap
            .timeline()
            .to(overlayRef.current, {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: 'power2.inOut',
            })
            .to(
              contentRef.current,
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.inOut',
              },
              '='
            )
            .to(titleRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: 'power2.inOut',
            })
            .to(
              blocksRef.current,
              {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.inOut',
              },
              '-=0.1'
            )
            .to(closeRef.current, {
              opacity: 1,
              duration: 0.3,
              ease: 'power2.inOut',
            });
        } else {
          // Desktop: slide in from right
          gsap.set(overlayRef.current, { opacity: 0, x: 200 });
          gsap.set(blocksRef.current, { opacity: 0, y: 20 });
          gsap.set(titleRef.current, { opacity: 0, x: 10 });
          gsap.set(closeRef.current, { opacity: 0 });
          gsap.set(contentRef.current, { opacity: 0, y: 20 });

          gsap
            .timeline()
            .to(overlayRef.current, {
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
              closeRef.current,
              {
                opacity: 1,
                duration: 0.2,
                ease: 'power2.out',
              },
              '-=0.1'
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
            );
        }
      } else if (shouldAnimate) {
        // Close animation
        const tl = gsap.timeline({
          onComplete: () => {
            setIsAnimating(false);
            onClose();
          },
        });

        if (isMobile) {
          tl.to(blocksRef.current, {
            opacity: 0,
            y: 10,
            duration: 0.2,
            ease: 'power2.in',
          })
            .to(
              closeRef.current,
              {
                opacity: 0,
                duration: 0.2,
                ease: 'power2.in',
              },
              '-=0.1'
            )
            .to(
              titleRef.current,
              {
                opacity: 0,
                y: 10,
                duration: 0.2,
                ease: 'power2.in',
              },
              '-=0.1'
            )
            .to(
              contentRef.current,
              {
                opacity: 0,
                y: 10,
                duration: 0.2,
                ease: 'power2.in',
              },
              '-=0.1'
            )
            .to(overlayRef.current, {
              y: '100%',
              opacity: 0,
              duration: 0.3,
              ease: 'power2.in',
            });
        } else {
          // Desktop: slide out to right
          tl.to(blocksRef.current, {
            opacity: 0,
            duration: 0.2,
            ease: 'power2.in',
          })
            .to(closeRef.current, {
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
              x: 200,
              duration: 0.3,
              ease: 'power2.inOut',
            });
        }
      }
    },
    { dependencies: [isVisible, isMobile, isAnimating] }
  );

  // Don't render if not visible
  if (!isVisible && !isAnimating) return null;

  const margin = 16;

  const { scrollAreaProps } = useOverlayScrollLock(isVisible && isMobile, {
    lockBody: true,
    overscrollBehaviorY: 'none',
    preventLenis: true,
    stopWheelPropagation: true,
    webkitMomentumScroll: true,
    className: 'touch-pan-y overscroll-y-contain',
  });
  const { className: overlayClassName = '', ...overlayProps } = scrollAreaProps as any;

  // Mobile layout: full screen overlay
  if (isMobile) {
    return (
      <div
        className="form-overlay pointer-events-none fixed inset-0 z-[60]"
        ref={overlayRef}
        style={{ WebkitTransform: 'translateZ(0)', backfaceVisibility: 'hidden' as any }}
      >
        <div className="pointer-events-auto absolute inset-0 flex flex-col bg-background">
          <div
            className="sticky top-0 z-10 flex items-center justify-between bg-background/95 p-4"
            ref={contentRef}
          >
            <h2 className="text-lg font-bold text-secondary/50" ref={titleRef}>
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
          <ScrollArea
            className={cn('flex-1 [&>[data-radix-scroll-area-scrollbar]]:w-1.5', overlayClassName)}
            {...overlayProps}
          >
            <div className="p-4" ref={blocksRef}>
              {hasSubmitted && (!blocks || blocks.length === 0) ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 px-4 py-12 text-center">
                  <div className="rounded-full bg-green-100 p-4">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">Request Submitted!</h3>
                    <p className="text-sm text-muted-foreground">
                      Thank you for your request. We'll contact you within 24 hours.
                    </p>
                  </div>
                  <div className="flex w-full max-w-xs flex-col gap-3">
                    <Button onClick={onSubmitAnother} variant="default" className="w-full">
                      <RotateCcw className="h-4 w-4" />
                      Submit Another Request
                    </Button>
                    <Button onClick={handleClose} variant="outline" className="w-full">
                      Close
                    </Button>
                  </div>
                </div>
              ) : blocks && blocks.length > 0 ? (
                <div className="flex flex-col gap-4">
                  <Blocks blocks={blocks} renderContext="overlay" />
                </div>
              ) : null}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  // Desktop layout: stacked on top of POI overlay
  // POI overlay width: max-w-[700px] or lg:max-w-[75vw]
  // Form overlay: 90% of POI width, right-aligned
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 flex"
      style={{
        paddingRight: `${margin}px`,
        paddingTop: `${margin}px`,
        paddingBottom: `${margin}px`,
      }}
    >
      <div className="flex flex-1 items-center justify-end">
        <div
          ref={overlayRef}
          className="pointer-events-auto flex h-full max-h-[90vh] w-[90%] max-w-[685px] flex-col bg-background shadow-2xl md:rounded-lg lg:max-w-[74.25vw]"
        >
          <div className="sticky top-0 z-10 rounded-t-lg bg-background/95 py-4 shadow-sm backdrop-blur-sm">
            <div className="relative flex items-center gap-4 px-6 lg:px-4">
              <div className="">
                <Button
                  size="icon"
                  onClick={handleClose}
                  className="h-8 w-8 bg-primary/10 text-primary hover:bg-primary/80 hover:text-primary-foreground [&_svg]:!size-6 [&_svg]:!stroke-[1.75]"
                  ref={closeRef}
                >
                  <X />
                </Button>
              </div>
              <div className="" ref={titleRef}>
                <h3 className="text-xl font-medium leading-none text-muted-foreground lg:text-xl lg:leading-none">
                  {title}
                </h3>
              </div>
            </div>
          </div>
          <ScrollArea className={cn('flex-1 rounded-b-lg px-4 lg:px-8')}>
            <div className="px-6 lg:px-8" ref={contentRef}>
              {hasSubmitted && (!blocks || blocks.length === 0) ? (
                <div
                  className="flex min-h-[500px] flex-col items-center justify-center gap-8 px-4 py-16 text-center"
                  ref={blocksRef}
                >
                  <div className="rounded-full bg-green-100 p-6">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-foreground">
                      Request Submitted Successfully!
                    </h3>
                    <p className="max-w-md text-base text-muted-foreground">
                      Thank you for your security request. Our team will review your information and
                      contact you within 24 hours.
                    </p>
                  </div>
                  <div className="flex w-full max-w-sm flex-col gap-3">
                    <Button
                      onClick={onSubmitAnother}
                      variant="default"
                      size="lg"
                      className="w-full"
                    >
                      <RotateCcw className="h-5 w-5" />
                      Submit Another Request
                    </Button>
                    <Button onClick={handleClose} variant="outline" size="lg" className="w-full">
                      Close
                    </Button>
                  </div>
                </div>
              ) : blocks && blocks.length > 0 ? (
                <div className="flex flex-col gap-4 pb-8 pt-4 lg:pb-12 lg:pt-8" ref={blocksRef}>
                  <Blocks blocks={blocks} renderContext="overlay" />
                </div>
              ) : null}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
