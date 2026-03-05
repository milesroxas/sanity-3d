'use client';
import Blocks from '@/components/blocks';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useExpandedContentStore } from '@/experience/scenes/store/expandedContentStore';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { usePoiStore } from '@/experience/scenes/store/poiStore';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useOverlayScrollLock } from '@/hooks/useOverlayScrollLock';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { FileText, MessageSquare, ShieldPlus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import FormOverlay from './FormOverlay';

interface PoiContentOverlayProps {
  poi: Sanity.PointOfInterest;
  isVisible: boolean;
  onClose: () => void;
  sceneTitle?: string;
  defaultActionButton?: {
    label: string;
    formType: string;
    icon?: string;
  };
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
export default function PoiContentOverlay({
  poi,
  isVisible,
  onClose,
  sceneTitle,
  defaultActionButton,
}: PoiContentOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);
  const actionButtonRef = useRef<HTMLButtonElement>(null);
  const [logoMarkerWidth, setLogoMarkerWidth] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // In interactive mode, drawer isn't visible but POI overlay should still work
  // Check if a scene is selected instead of checking drawer visibility
  const selectedScene = useLogoMarkerStore(s => s.selectedScene);
  const isSceneActive = !!selectedScene;

  // Sync overlay visibility state with poiStore to control main close button
  const setIsPoiOverlayVisible = usePoiStore(s => s.setIsPoiOverlayVisible);

  // Expanded content state for action button overlays
  const title = useExpandedContentStore(s => s.title);
  const blocks = useExpandedContentStore(s => s.blocks);
  const isExpandedVisible = useExpandedContentStore(s => s.isVisible);
  const hasSubmitted = useExpandedContentStore(s => s.hasSubmitted);
  const setExpandedContent = useExpandedContentStore(s => s.setExpandedContent);
  const closeExpandedContent = useExpandedContentStore(s => s.closeExpandedContent);
  const markAsSubmitted = useExpandedContentStore(s => s.markAsSubmitted);
  const resetSubmissionState = useExpandedContentStore(s => s.resetSubmissionState);
  const clearBlocks = useExpandedContentStore(s => s.clearBlocks);

  // Merge POI actionButton with default settings
  // Only use POI's custom actionButton values if customizeActionButton toggle is enabled
  // Priority: POI custom values (if enabled) > default values > fallback values
  const customActionButton = poi.customizeActionButton ? poi.actionButton : undefined;
  const effectiveActionButton = {
    label: customActionButton?.label || defaultActionButton?.label || 'Request Free Quote',
    formType:
      customActionButton?.formType || defaultActionButton?.formType || 'form-security-request',
    icon: customActionButton?.icon || defaultActionButton?.icon || 'ShieldPlus',
  };

  // Helper: get icon component from string name
  const getIconComponent = (iconName?: string) => {
    const iconMap: Record<string, any> = {
      ShieldPlus,
      FileText,
      MessageSquare,
    };
    return iconName ? iconMap[iconName] : null;
  };

  // Helper: open form overlay
  const openFormOverlay = (actionButton: { label: string; formType: string; icon?: string }) => {
    const overlayBlocks = [
      {
        _type: actionButton.formType,
        _key: `${actionButton.formType}-overlay`,
        colorVariant: 'transparent',
        padding: 'none',
        direction: 'both',
        variant: 'overlay',
        onSuccess: markAsSubmitted,
      },
    ] as unknown as Sanity.Block[];
    setExpandedContent(actionButton.label, overlayBlocks);
  };

  // Helper: handle submitting another request
  const handleSubmitAnother = () => {
    // Just open the form - don't reset hasSubmitted yet
    // hasSubmitted will only be reset after successful new submission
    openFormOverlay(effectiveActionButton);
  };

  // Helper: handle form overlay close
  const handleFormClose = () => {
    // If we have submitted and the overlay is closing, clear the blocks
    // This ensures that when the overlay is opened again, it shows the success screen
    if (hasSubmitted && blocks && blocks.length > 0) {
      clearBlocks();
    }
    closeExpandedContent();
  };

  // Helper: handle action button click
  const handleActionButtonClick = () => {
    // If already submitted, just show the overlay (which will show success screen)
    if (hasSubmitted) {
      // Don't pass blocks - we want FormOverlay to show success screen based on hasSubmitted flag
      setExpandedContent(effectiveActionButton.label, []);
    } else {
      // Otherwise, open fresh form
      openFormOverlay(effectiveActionButton);
    }
  };

  // Sync visibility state - update store when overlay shows/hides
  useEffect(() => {
    // Only set to visible when fully shown (not animating out)
    const shouldBeVisible = isVisible && isSceneActive && !isAnimating;
    setIsPoiOverlayVisible(shouldBeVisible);

    // Cleanup: ensure we reset state when component unmounts
    return () => {
      setIsPoiOverlayVisible(false);
    };
  }, [isVisible, isSceneActive, isAnimating, setIsPoiOverlayVisible]);

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

  // Close expanded content when POI overlay is closed
  useEffect(() => {
    if (!isVisible) {
      closeExpandedContent();
      // Reset submission state when POI closes
      resetSubmissionState();
    }
  }, [isVisible, closeExpandedContent, resetSubmissionState]);

  // Handle click outside to close (only if FormOverlay is not open)
  useEffect(() => {
    if (!isVisible || isAnimating || isExpandedVisible) return;

    const handleClickOutside = (event: PointerEvent) => {
      // If any Radix dialog is open, let it handle its own dismissal
      if (document.querySelector('[data-radix-dialog-overlay]')) {
        return;
      }
      const target = event.target as Node;
      if (contentContainerRef.current && !contentContainerRef.current.contains(target)) {
        handleClose();
      }
    };

    // Add slight delay to prevent immediate closing on open
    const timeoutId = setTimeout(() => {
      document.addEventListener('pointerdown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [isVisible, isAnimating, isExpandedVisible]);

  // Escape key handling - close expanded content first, then POI overlay
  useEscapeKey({
    enabled: isVisible,
    condition: !isAnimating && !isExpandedVisible,
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
          if (!contentContainerRef.current) return;

          gsap.set(contentContainerRef.current, { opacity: 0, x: 200 });
          gsap.set(blocksRef.current, { opacity: 0, y: 20 });
          gsap.set(titleRef.current, { opacity: 0, x: 10 });
          gsap.set(closeRef.current, { opacity: 0 });
          gsap.set(contentRef.current, { opacity: 0, y: 20 });
          gsap.set(actionButtonRef.current, { opacity: 0 });
          gsap
            .timeline()
            .to(contentContainerRef.current, {
              opacity: 1,
              duration: 0.5,
              ease: 'power2.in',
            })
            .to(
              contentContainerRef.current,
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
              actionButtonRef.current,
              {
                opacity: 1,
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
            .to(actionButtonRef.current, {
              opacity: 0,
              duration: 0.2,
              ease: 'power2.in',
            })
            .to(contentContainerRef.current, {
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
  // Action button is always shown (using effective merged config)
  const hasActionButton = true;
  const IconComponent = getIconComponent(effectiveActionButton.icon);

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
      <>
        <div
          className="poi-overlay pointer-events-none fixed inset-0 z-50"
          ref={overlayRef}
          style={{ WebkitTransform: 'translateZ(0)', backfaceVisibility: 'hidden' as any }}
        >
          <div
            ref={contentContainerRef}
            className="pointer-events-auto absolute inset-0 flex flex-col bg-background"
          >
            <div
              className="sticky top-0 z-10 flex items-center justify-between bg-background/15 p-4"
              ref={contentRef}
            >
              <h2 className="text-lg font-bold text-secondary/50" ref={titleRef}>
                {sceneTitle || poi.title}
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
              className={cn(
                'flex-1 [&>[data-radix-scroll-area-scrollbar]]:w-1.5',
                overlayClassName
              )}
              {...overlayProps}
            >
              <div className={cn('p-4', hasActionButton && 'pb-24')} ref={blocksRef}>
                {hasBlocks ? (
                  <div className="flex flex-col gap-8">
                    <Blocks blocks={poi.blocks!} renderContext="overlay" />
                  </div>
                ) : hasBody ? (
                  <PortableTextRenderer value={poi.body!} variant="sheet" />
                ) : (
                  <p className="text-muted-foreground">No content available</p>
                )}
              </div>
            </ScrollArea>
            {hasActionButton && (
              <div className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-center bg-white px-4 py-4 shadow-md shadow-slate-800">
                <Button
                  variant={isExpandedVisible ? 'inactive' : 'default'}
                  size="default"
                  disabled={isExpandedVisible}
                  className="h-10 w-full text-sm font-bold hover:-translate-y-px hover:shadow-lg active:translate-y-0"
                  onClick={handleActionButtonClick}
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  <span className="truncate">{effectiveActionButton.label}</span>
                </Button>
              </div>
            )}
          </div>
        </div>
        {isExpandedVisible && title && (
          <FormOverlay
            title={title}
            isVisible={isExpandedVisible}
            onClose={handleFormClose}
            blocks={blocks || []}
            hasSubmitted={hasSubmitted}
            onSubmitAnother={handleSubmitAnother}
          />
        )}
      </>
    );
  }

  // Desktop layout
  return (
    <>
      <div
        ref={overlayRef}
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
            ref={contentContainerRef}
            className="pointer-events-auto flex h-full max-h-[95vh] w-full max-w-[700px] flex-col bg-background/75 shadow-xl md:rounded-lg md:backdrop-blur-lg lg:max-w-[60vw]"
          >
            <div className="sticky top-0 z-10 rounded-t-lg bg-background/95 py-4 shadow-sm backdrop-blur-sm">
              <div className="relative flex items-center gap-4 px-6 lg:px-4">
                <div className="flex w-full items-center gap-4">
                  <Button
                    size="icon"
                    onClick={handleClose}
                    className="h-8 w-8 bg-primary/10 text-primary hover:bg-primary/80 hover:text-primary-foreground [&_svg]:!size-6 [&_svg]:!stroke-[1.75]"
                    ref={closeRef}
                  >
                    <X />
                  </Button>

                  <div className="" ref={titleRef}>
                    <h3 className="text-xl font-bold leading-none text-muted-foreground lg:text-xl lg:leading-none">
                      {sceneTitle || poi.title}
                    </h3>
                  </div>
                </div>
                {hasActionButton && (
                  <Button
                    variant={isExpandedVisible ? 'inactive' : 'default'}
                    size="default"
                    disabled={isExpandedVisible}
                    className="h-8 px-2 text-sm font-bold hover:-translate-y-px hover:shadow-lg active:translate-y-0"
                    onClick={handleActionButtonClick}
                    ref={actionButtonRef}
                  >
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    <span className="truncate">{effectiveActionButton.label}</span>
                  </Button>
                )}
              </div>
            </div>
            <ScrollArea className={cn('flex-1 rounded-b-lg')}>
              <div className="p-12" ref={contentRef}>
                <div className={cn('flex flex-col gap-12')} ref={blocksRef}>
                  {hasBlocks ? (
                    <Blocks blocks={poi.blocks!} renderContext="overlay" />
                  ) : hasBody ? (
                    <div className="max-w-2xl">
                      <PortableTextRenderer value={poi.body!} variant="sheet" />
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No content available</p>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
      {isExpandedVisible && title && (
        <FormOverlay
          title={title}
          isVisible={isExpandedVisible}
          onClose={handleFormClose}
          blocks={blocks || []}
          hasSubmitted={hasSubmitted}
          onSubmitAnother={handleSubmitAnother}
        />
      )}
    </>
  );
}
