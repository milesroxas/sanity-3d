'use client';
import Blocks from '@/components/blocks';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { LinkButton } from '@/components/shared/link-button';
import { Button } from '@/components/ui/button';
import { useExpandedContentStore } from '@/experience/scenes/store/expandedContentStore';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { ArrowRight, ArrowUpFromLine, PanelLeftOpen, ShieldPlus, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import MarkerContentOverlay from './MarkerContentOverlay';

export default function LogoMarkerContent() {
  // Select only needed pieces from the stores to avoid unnecessary re-renders
  const selectedScene = useLogoMarkerStore(s => s.selectedScene);
  const isContentVisible = useLogoMarkerStore(s => s.isContentVisible);
  const setContentVisible = useLogoMarkerStore(s => s.setContentVisible);
  const setShouldAnimateBack = useLogoMarkerStore(s => s.setShouldAnimateBack);
  const setOtherMarkersVisible = useLogoMarkerStore(s => s.setOtherMarkersVisible);

  const title = useExpandedContentStore(s => s.title);
  const blocks = useExpandedContentStore(s => s.blocks);
  const isVisible = useExpandedContentStore(s => s.isVisible);
  const setExpandedContent = useExpandedContentStore(s => s.setExpandedContent);
  const closeExpandedContent = useExpandedContentStore(s => s.closeExpandedContent);

  // Refs
  const drawerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // State
  // Track mobile to tune behavior and avoid expensive effects/classes
  const [isMobile, setIsMobile] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('Security Services');
  const [previousTitle, setPreviousTitle] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeOverlaySource, setActiveOverlaySource] = useState<'security' | 'expand' | null>(
    null
  );

  // Keep a ref of the current headerTitle to avoid re-binding scroll listeners
  const headerTitleRef = useRef(headerTitle);
  useEffect(() => {
    headerTitleRef.current = headerTitle;
  }, [headerTitle]);

  // GSAP animation for entry
  useEffect(() => {
    if (!drawerRef.current) return;

    if (isContentVisible) {
      // Reset title to default
      setHeaderTitle('Security Services');
      setPreviousTitle('');

      // Animate drawer in when visible
      gsap.fromTo(
        drawerRef.current,
        { x: '-100%' },
        {
          x: 0,
          duration: 1,
          ease: 'power2.inOut',
        }
      );
    }
  }, [isContentVisible]);

  // Track mobile state and update on resize (passive)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Animation for title change
  useEffect(() => {
    if (!titleRef.current || previousTitle === headerTitle || !isContentVisible) return;

    setIsAnimating(true);

    // Check if we're on mobile
    const isMobile = window.innerWidth < 768;

    // Animate title change with slide and fade
    gsap.fromTo(
      titleRef.current,
      {
        opacity: 0,
        // Use y animation for mobile, x for desktop
        ...(isMobile
          ? { y: previousTitle === 'Security Services' ? -10 : 10 }
          : { x: previousTitle === 'Security Services' ? -20 : 20 }),
      },
      {
        opacity: 1,
        // Reset the appropriate axis
        ...(isMobile ? { y: 0 } : { x: 0 }),
        duration: 0.35,
        ease: 'power1.out',
        onComplete: () => setIsAnimating(false),
      }
    );
  }, [headerTitle, previousTitle, isContentVisible]);

  // Set up scroll event listener for title swap with hysteresis and rAF throttle
  useEffect(() => {
    if (!isContentVisible) return;
    const el = scrollRef.current;
    if (!el) return;

    let ticking = false;
    const SHOW_THRESHOLD = 120; // reveal scene title after scrolling past
    const HIDE_THRESHOLD = 60; // switch back sooner when scrolling up

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (isAnimating) return;
        const top = el.scrollTop;
        const next =
          top > SHOW_THRESHOLD ? selectedScene?.title || 'Security Services' : 'Security Services';
        const current = headerTitleRef.current;

        // Apply hysteresis when toggling back to default
        if (
          current !== 'Security Services' &&
          top > HIDE_THRESHOLD &&
          next === 'Security Services'
        ) {
          return;
        }

        if (next !== current) {
          setPreviousTitle(current);
          setHeaderTitle(next);
        }
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [isContentVisible, selectedScene, isAnimating]);

  const handleClose = () => {
    if (!drawerRef.current) return;

    // Animate drawer out - MarkerContentOverlay will handle its own close animation
    gsap.to(drawerRef.current, {
      x: '-100%',
      duration: 0.75,
      ease: 'power2.in',
      onComplete: () => {
        setContentVisible(false);
        setShouldAnimateBack(true);
        setOtherMarkersVisible(false);
        closeExpandedContent();
      },
    });
  };

  // Handle escape key to close logo marker content (lower priority)
  useEscapeKey({
    enabled: isContentVisible,
    // Disable drawer Escape while overlay is open
    condition: !isAnimating && !isVisible,
    priority: 0,
    onEscape: handleClose,
  });

  // Helper: open overlay with provided blocks and title
  const openOverlay = (overlayTitle: string, overlayBlocks: Sanity.Block[]) => {
    setExpandedContent(overlayTitle, overlayBlocks);
  };

  // Helper: build overlay blocks from mainExpandedBody
  const buildExpandedBodyOverlayBlocks = (eb: Sanity.Scene['mainExpandedBody']) => {
    return [
      {
        _type: 'expanded-body',
        _key: 'main-expanded',
        blocks: eb?.blocks || [],
        links: eb?.links || [],
      },
    ] as unknown as Sanity.Block[];
  };

  // Helper: open security request form overlay
  const openSecurityRequestOverlay = () => {
    const overlayBlocks = [
      {
        _type: 'form-security-request',
        _key: 'security-request',
        // Styling for overlay context
        colorVariant: 'transparent',
        padding: 'none',
        direction: 'both',
        variant: 'overlay',
      },
    ] as unknown as Sanity.Block[];
    setActiveOverlaySource('security');
    openOverlay('Security Request', overlayBlocks);
  };

  // Also add an effect to sync the expanded content with logo marker visibility:
  useEffect(() => {
    if (!isContentVisible) {
      closeExpandedContent();
    }
  }, [isContentVisible, closeExpandedContent]);

  // Reset which button is marked active when overlay hides
  useEffect(() => {
    if (!isVisible) {
      setActiveOverlaySource(null);
    }
  }, [isVisible]);

  if (!selectedScene) return null;

  const memoBody = useMemo(() => {
    if (!selectedScene?.body) return null;
    return (
      <div className="flex-1">
        <PortableTextRenderer value={selectedScene.body} variant="drawer" />
      </div>
    );
  }, [selectedScene?.body]);

  return (
    <>
      {isContentVisible && (
        <div
          ref={drawerRef}
          className="marker-content fixed left-0 top-0 z-20 flex h-full w-full flex-col bg-background pb-16 shadow-xl will-change-transform md:w-[35vw] md:min-w-[400px] md:backdrop-blur-md lg:w-[40vw] lg:min-w-[450px]"
        >
          {/* Header with title that changes based on scroll */}
          <div className="sticky top-0 z-10 flex items-center justify-between overflow-hidden bg-background/95 pb-2 pl-6 pr-6 pt-2 md:backdrop-blur-sm">
            <h2
              ref={titleRef}
              className={`text-sm font-bold uppercase ${
                headerTitle === 'Security Services' ? 'text-gray-600' : 'text-secondary'
              }`}
            >
              {headerTitle}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-primary hover:bg-primary/10 [&_svg]:!size-6"
            >
              <X />
            </Button>
          </div>

          {/* Unified content area with native scroll (prevents remounts and improves iOS perf) */}
          <div
            className="flex-1 touch-pan-y overflow-y-auto overscroll-y-contain"
            ref={scrollRef}
            style={{
              WebkitOverflowScrolling: 'touch',
              backfaceVisibility: 'hidden' as any,
            }}
          >
            <div ref={contentRef} className="flex flex-col p-6 pb-20 pt-4">
              <h3 className="mb-6 pr-8 text-lg font-bold text-secondary md:text-3xl">
                {selectedScene.title}
              </h3>
              {memoBody}
              {selectedScene.blocks && selectedScene.blocks.length > 0 ? (
                <div className="flex flex-col gap-4">
                  <Blocks blocks={selectedScene.blocks} />
                </div>
              ) : null}
            </div>
          </div>

          {/* Fixed bottom action area: left = Security Request; right = Link or Expanded */}
          <div className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-center bg-white px-4 py-4 shadow-md shadow-slate-800 will-change-transform">
            <div className="flex w-full gap-3">
              {(() => {
                const hasRightAction =
                  Boolean(selectedScene.links && selectedScene.links.length > 0) ||
                  Boolean(selectedScene.mainExpandedBody);

                return (
                  <>
                    {/* Left: Always show Security Request Form trigger */}
                    <Button
                      variant={
                        isVisible && activeOverlaySource === 'security' ? 'inactive' : 'default'
                      }
                      size="default"
                      disabled={isVisible && activeOverlaySource === 'security'}
                      className={cn(
                        'h-10 text-sm font-bold hover:-translate-y-px hover:shadow-lg active:translate-y-0',
                        hasRightAction ? 'w-1/2' : 'w-full'
                      )}
                      onClick={openSecurityRequestOverlay}
                    >
                      <ShieldPlus className="h-4 w-4" />
                      <span className="truncate">Request Security</span>
                    </Button>

                    {/* Right: Prefer main link; fallback to expanded content */}
                    {hasRightAction &&
                      (selectedScene.links && selectedScene.links.length > 0 ? (
                        <LinkButton
                          link={selectedScene.links[0]}
                          className={cn(
                            'h-10 w-1/2 text-sm font-bold hover:-translate-y-px hover:shadow-lg active:translate-y-0'
                          )}
                          icon={ArrowRight}
                          iconPosition="right"
                          onClick={closeExpandedContent}
                        />
                      ) : (
                        <Button
                          className={cn(
                            'h-10 w-1/2 hover:-translate-y-px hover:shadow-lg active:translate-y-0'
                          )}
                          variant={
                            isVisible && activeOverlaySource === 'expand' ? 'inactive' : 'outline'
                          }
                          disabled={isVisible && activeOverlaySource === 'expand'}
                          onClick={() => {
                            const overlayBlocks = buildExpandedBodyOverlayBlocks(
                              selectedScene.mainExpandedBody
                            );
                            setActiveOverlaySource('expand');
                            openOverlay(selectedScene.title || 'Details', overlayBlocks);
                          }}
                        >
                          <span className="truncate">Expand</span>
                          <ArrowUpFromLine className="mr-2 h-4 w-4 md:hidden" />
                          <PanelLeftOpen className="mr-2 hidden md:block" />
                        </Button>
                      ))}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      {isVisible && title && (
        <MarkerContentOverlay
          title={title}
          isVisible={isVisible}
          onClose={closeExpandedContent}
          blocks={blocks || []}
        />
      )}
    </>
  );
}
