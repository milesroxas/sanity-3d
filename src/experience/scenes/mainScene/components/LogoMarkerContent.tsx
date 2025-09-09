'use client';
import Blocks from '@/components/blocks';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { LinkButton } from '@/components/shared/link-button';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useExpandedContentStore } from '@/experience/scenes/store/expandedContentStore';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { ArrowRight, ArrowUpFromLine, PanelLeftOpen, ShieldPlus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MarkerContentOverlay from './MarkerContentOverlay';

export default function LogoMarkerContent() {
  const {
    selectedScene,
    isContentVisible,
    setContentVisible,
    setShouldAnimateBack,
    setOtherMarkersVisible,
  } = useLogoMarkerStore();
  const { title, blocks, isVisible, setExpandedContent, closeExpandedContent } =
    useExpandedContentStore();

  // Refs
  const drawerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // State
  const [hasOverflow, setHasOverflow] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('Security Services');
  const [previousTitle, setPreviousTitle] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

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

  // Check for content overflow
  useEffect(() => {
    if (!contentRef.current) return;

    const checkOverflow = () => {
      if (contentRef.current) {
        const hasScrollableContent =
          contentRef.current.scrollHeight > contentRef.current.clientHeight;
        setHasOverflow(hasScrollableContent);
      }
    };

    // Check initially
    checkOverflow();

    // Re-check on window resize
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [isContentVisible, selectedScene]);

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

  // Set up scroll event listener for title swap
  useEffect(() => {
    if (!isContentVisible) return;

    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      // Don't change if animation is in progress
      if (isAnimating) return;

      // Simple threshold check to swap titles
      const newTitle =
        scrollElement.scrollTop > 80
          ? selectedScene?.title || 'Security Services'
          : 'Security Services';

      if (newTitle !== headerTitle) {
        setPreviousTitle(headerTitle);
        setHeaderTitle(newTitle);
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [isContentVisible, selectedScene, headerTitle, isAnimating]);

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
    openOverlay('Security Request', overlayBlocks);
  };

  // Also add an effect to sync the expanded content with logo marker visibility:
  useEffect(() => {
    if (!isContentVisible) {
      closeExpandedContent();
    }
  }, [isContentVisible, closeExpandedContent]);

  if (!selectedScene) return null;

  return (
    <>
      {isContentVisible && (
        <div
          ref={drawerRef}
          className="marker-content fixed left-0 top-0 z-20 flex h-full w-full flex-col bg-background pb-16 shadow-xl backdrop-blur-md md:w-[35vw] md:min-w-[400px] lg:w-[40vw] lg:min-w-[450px]"
        >
          {/* Header with title that changes based on scroll */}
          <div className="sticky top-0 z-10 flex items-center justify-between overflow-hidden bg-background/95 pb-2 pl-6 pr-6 pt-2 backdrop-blur-sm">
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

          {/* Content area with scrollable content */}
          {hasOverflow ? (
            <div className="custom-scrollbar flex-1">
              <ScrollArea className="h-full">
                <div ref={contentRef} className="flex flex-col p-6 pb-20 pt-4">
                  <h3 className="mb-6 pr-8 text-lg font-bold text-secondary md:text-3xl">
                    {selectedScene.title}
                  </h3>
                  {selectedScene.body && (
                    <div className="flex-1">
                      <PortableTextRenderer value={selectedScene.body} variant="drawer" />
                    </div>
                  )}
                  {selectedScene.blocks && selectedScene.blocks.length > 0 ? (
                    <Blocks blocks={selectedScene.blocks} />
                  ) : null}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto" ref={scrollRef}>
              <div ref={contentRef} className="flex flex-col p-6 pb-20 pt-4">
                <h3 className="mb-6 pr-8 text-lg font-bold text-secondary md:text-3xl">
                  {selectedScene.title}
                </h3>
                {selectedScene.body && (
                  <div className="flex-1">
                    <PortableTextRenderer value={selectedScene.body} variant="drawer" />
                  </div>
                )}
                {selectedScene.blocks && selectedScene.blocks.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    <Blocks blocks={selectedScene.blocks} />
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Fixed bottom action area: left = Security Request; right = Link or Expanded */}
          <div className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-center bg-white px-4 py-4 shadow-md shadow-slate-800">
            <div className="flex w-full gap-3">
              {(() => {
                const hasRightAction =
                  Boolean(selectedScene.links && selectedScene.links.length > 0) ||
                  Boolean(selectedScene.mainExpandedBody);

                // Debug logging
                console.log('LogoMarkerContent Debug:', {
                  hasLinks: Boolean(selectedScene.links && selectedScene.links.length > 0),
                  hasMainExpandedBody: Boolean(selectedScene.mainExpandedBody),
                  hasRightAction,
                  selectedScene: selectedScene.title,
                });

                return (
                  <>
                    {/* Left: Always show Security Request Form trigger */}
                    <Button
                      variant="default"
                      size="default"
                      className={cn(
                        'h-10 text-sm font-bold hover:shadow-md',
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
                          className={cn('h-10 w-1/2 text-sm font-bold hover:shadow-md')}
                          icon={ArrowRight}
                          iconPosition="right"
                          onClick={closeExpandedContent}
                        />
                      ) : (
                        <Button
                          className={cn('h-10 w-1/2')}
                          variant={isVisible ? 'inactive' : 'outline'}
                          disabled={isVisible}
                          onClick={() => {
                            const overlayBlocks = buildExpandedBodyOverlayBlocks(
                              selectedScene.mainExpandedBody
                            );
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
