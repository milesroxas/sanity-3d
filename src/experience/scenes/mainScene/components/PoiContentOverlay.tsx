'use client';
import Blocks from '@/components/blocks';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { LinkButton } from '@/components/shared/link-button';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useOverlayScrollLock } from '@/hooks/useOverlayScrollLock';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight, PanelLeftClose, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface PoiContentOverlayProps {
  poi: Sanity.PointOfInterest;
  isVisible: boolean;
  onClose: () => void;
}

/**
 * PoiContentOverlay - Displays POI content in an overlay
 *
 * Similar to MarkerContentOverlay but specifically for POI content.
 * Supports both legacy body field and new blocks field.
 *
 * Features:
 * - Responsive mobile/desktop layouts
 * - GSAP animations
 * - Escape key handling
 * - Scroll lock on mobile
 */
export default function PoiContentOverlay({ poi, isVisible, onClose }: PoiContentOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);

  const [logoMarkerWidth, setLogoMarkerWidth] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // In interactive mode, drawer isn't visible but POI overlay should still work
  // Check if a scene is selected instead of checking drawer visibility
  const selectedScene = useLogoMarkerStore(s => s.selectedScene);
  const isSceneActive = !!selectedScene;

  // Calculate layout dimensions
  useEffect(() => {
    const checkMobileAndCalculateWidth = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      const logoMarkerContent = document.querySelector('.marker-content');
      if (logoMarkerContent) {
        const width = logoMarkerContent.getBoundingClientRect().width;
        setLogoMarkerWidth(width);
      } else {
        setLogoMarkerWidth(Math.min(480, window.innerWidth * 0.35));
      }
    };

    checkMobileAndCalculateWidth();
    window.addEventListener('resize', checkMobileAndCalculateWidth, { passive: true });

    return () => {
      window.removeEventListener('resize', checkMobileAndCalculateWidth);
    };
  }, [isVisible]);

  // Close if scene is deselected
  useEffect(() => {
    if (!isSceneActive && isVisible && !isAnimating) {
      handleClose();
    }
  }, [isSceneActive, isVisible, isAnimating]);

  const handleClose = () => {
    setIsAnimating(true);
  };

  // Escape key handling
  useEscapeKey({
    enabled: isVisible,
    condition: !isAnimating,
    priority: 2, // Higher priority than logo marker content
    onEscape: handleClose,
  });

  // GSAP animations
  useGSAP(
    () => {
      if (!overlayRef.current) return;

      const shouldShow = isVisible && isSceneActive && !isAnimating;
      const shouldHide = isAnimating;

      if (shouldShow) {
        setIsAnimating(false);

        if (isMobile) {
          // Mobile: slide up animation
          gsap.set(overlayRef.current, { y: '100%', x: 0, opacity: 0 });
          gsap.set(titleRef.current, { opacity: 0, y: 10, x: 0 });
          gsap.set(contentRef.current, { opacity: 0, y: 20, x: 0 });
          gsap.set(blocksRef.current, { opacity: 0, y: 20, x: 0 });
          gsap.set(closeRef.current, { opacity: 0, x: 0 });

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
              opacity: 0.75,
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
                opacity: 0.75,
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
      } else if (shouldHide) {
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
    { dependencies: [isVisible, isSceneActive, isMobile, isAnimating] }
  );

  // Don't render if not visible
  if ((!isVisible && !isAnimating) || !isSceneActive) return null;

  // Determine content to display (prefer blocks over body)
  const hasBlocks = poi.blocks && poi.blocks.length > 0;
  const hasBody = poi.body && poi.body.length > 0;
  const hasLinks = poi.links && poi.links.length > 0;

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

  // Mobile layout
  if (isMobile) {
    return (
      <div
        className="poi-overlay pointer-events-none fixed inset-0 z-50"
        ref={overlayRef}
        style={{ WebkitTransform: 'translateZ(0)', backfaceVisibility: 'hidden' as any }}
      >
        <div className="pointer-events-auto absolute inset-0 flex flex-col bg-background">
          <div
            className="sticky top-0 z-10 flex items-center justify-between bg-background/15 p-4"
            ref={contentRef}
          >
            <h2 className="text-lg font-bold text-secondary/50" ref={titleRef}>
              {poi.title}
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
              {hasBlocks ? (
                <div className="flex flex-col gap-4">
                  <Blocks blocks={poi.blocks!} renderContext="overlay" />
                </div>
              ) : hasBody ? (
                <PortableTextRenderer value={poi.body!} variant="drawer" />
              ) : (
                <p className="text-muted-foreground">No content available</p>
              )}
              {hasLinks && (
                <div className="mt-6 flex flex-col gap-3">
                  {poi.links!.map(link => (
                    <LinkButton
                      key={link._key}
                      link={link}
                      icon={ArrowRight}
                      iconPosition="right"
                      className="w-full"
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 flex"
      style={{
        paddingLeft: `${margin}px`,
        paddingRight: `${margin}px`,
        paddingTop: `${margin}px`,
        paddingBottom: `${margin}px`,
      }}
    >
      <div className="flex flex-1 items-center justify-end">
        <div
          ref={overlayRef}
          className="pointer-events-auto flex h-full max-h-[90vh] w-full max-w-[700px] flex-col bg-background/75 shadow-xl md:rounded-lg md:backdrop-blur-lg lg:max-w-[800px]"
        >
          <div className="sticky top-0 z-10 rounded-t-lg bg-background/15 pb-4 pt-4 shadow-sm backdrop-blur-sm">
            <div className="relative flex items-center px-14 lg:px-16">
              <div className="" ref={titleRef}>
                <h3 className="text-xl font-medium leading-none text-muted-foreground lg:text-2xl lg:leading-none">
                  {poi.title}
                </h3>
              </div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 lg:left-3">
                <Button
                  size="icon"
                  onClick={handleClose}
                  className="bg-primary/10 text-primary hover:bg-primary/80 hover:text-primary-foreground [&_svg]:!size-6 [&_svg]:!stroke-[1.75]"
                  ref={closeRef}
                >
                  <PanelLeftClose />
                </Button>
              </div>
            </div>
          </div>
          <ScrollArea className={cn('flex-1 rounded-b-lg px-6 lg:px-10')}>
            <div className="px-8 lg:px-10" ref={contentRef}>
              <div
                className="flex flex-col gap-6 pb-8 pt-6 lg:gap-8 lg:pb-12 lg:pt-10"
                ref={blocksRef}
              >
                {hasBlocks ? (
                  <Blocks blocks={poi.blocks!} />
                ) : hasBody ? (
                  <PortableTextRenderer value={poi.body!} variant="drawer" />
                ) : (
                  <p className="text-muted-foreground">No content available</p>
                )}
                {hasLinks && (
                  <div className="mt-6 flex flex-col gap-3 lg:mt-8">
                    {poi.links!.map(link => (
                      <LinkButton
                        key={link._key}
                        link={link}
                        icon={ArrowRight}
                        iconPosition="right"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
