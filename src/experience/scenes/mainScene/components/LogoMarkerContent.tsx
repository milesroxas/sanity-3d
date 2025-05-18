'use client';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import gsap from 'gsap';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function LogoMarkerContent() {
  const {
    selectedScene,
    isContentVisible,
    setContentVisible,
    setShouldAnimateBack,
    setOtherMarkersVisible,
  } = useLogoMarkerStore();

  // Refs
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
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

    // Animate title change with horizontal slide and fade
    gsap.fromTo(
      titleRef.current,
      {
        opacity: 0,
        x: previousTitle === 'Security Services' ? -20 : 20, // Direction based on which way we're transitioning
      },
      {
        opacity: 1,
        x: 0,
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

  // Clean up any pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClose = () => {
    if (!drawerRef.current) return;

    // Animate drawer out
    gsap.to(drawerRef.current, {
      x: '-100%',
      duration: 0.75,
      ease: 'power2.in',
      onComplete: () => {
        // Set state to false after animation completes
        setContentVisible(false);

        // Trigger camera animation
        setShouldAnimateBack(true);

        // Hide other markers with a small delay
        setTimeout(() => {
          setOtherMarkersVisible(false);
        }, 100);
      },
    });
  };

  if (!selectedScene) return null;

  return (
    <>
      {isContentVisible && (
        <div
          ref={drawerRef}
          className="fixed left-0 top-0 z-20 flex h-full w-full max-w-md flex-col bg-background shadow-xl backdrop-blur-md md:max-w-lg"
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
                    <div className="flex-1 text-sm text-secondary md:text-base">
                      <PortableTextRenderer value={selectedScene.body} variant="drawer" />
                    </div>
                  )}
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
                  <div className="flex-1 text-sm text-secondary md:text-base">
                    <PortableTextRenderer value={selectedScene.body} variant="drawer" />
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-center pb-4 pl-6 pr-6 pt-2">
            {selectedScene.link && selectedScene.link.length > 0 && (
              <Link
                className="w-full"
                href={(() => {
                  const link = selectedScene.link[0];

                  // Handle servicesLink type - use the services reference ID
                  if (link._type === 'servicesLink' && link.services?.slug?.current) {
                    return `/services/${link.services.slug.current}`;
                  }
                  // Handle other link types
                  else if (link._type === 'pageLink' && link.page?.slug?.current) {
                    return `/page/${link.page.slug.current}`;
                  } else if (link._type === 'legalLink' && link.legal?.slug?.current) {
                    return `/legal/${link.legal.slug.current}`;
                  }
                  // Custom link with direct href
                  else if (link._type === 'customLink' && link.href) {
                    return link.href;
                  }
                  // Fallback
                  else {
                    return '#';
                  }
                })()}
                target={selectedScene.link[0].target ? '_blank' : undefined}
              >
                <Button className="w-full">{selectedScene.link[0].title || 'Learn More'}</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
