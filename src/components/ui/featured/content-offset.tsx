'use client';

import PortableTextRenderer from '@/components/portable-text-renderer';
import { Button } from '@/components/ui/button';
import SectionContainer from '@/components/ui/section-container';
import TagLine from '@/components/ui/tag-line';
import { useBlockScrollTrigger } from '@/hooks/useBlockScrollTrigger';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { stegaClean } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';
import { createElement, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface FeaturedContentOffsetProps {
  content?: any;
  image?: { asset?: { url: string }; alt?: string };
  graphic?: { asset?: { url: string }; alt?: string };
  tagLine?: string;
  title?: string;
  links?: any[];
  testimonials?: any[];
  themeVariant?: string;
  _key?: string;
}

export default function FeaturedContentOffset(props: FeaturedContentOffsetProps) {
  const { content, image, graphic, tagLine, title, links, themeVariant, _key } = props;

  // Debug state to track animation progress
  const [debugProgress, setDebugProgress] = useState(0);

  const theme = stegaClean(themeVariant);
  const isDark = theme === 'dark';

  // Use the block scroll trigger hook for consistent ScrollTrigger management
  const { blockRef, createScrollTrigger, runAnimations } = useBlockScrollTrigger(_key);

  // Element refs for specific animations within the block
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const graphicRef = useRef<HTMLDivElement>(null);
  const blockOverlayRef = useRef<HTMLDivElement>(null);

  // Always show markers for debugging
  const showMarkers = true;

  // Register the plugin just to be safe
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    console.log('🟢 ScrollTrigger registered for content-offset', _key);
  }, [_key]);

  // Set up animations when the component mounts
  useEffect(() => {
    // Make sure refs are ready
    const container = containerRef.current;
    if (!container || !blockRef.current || !blockOverlayRef.current) {
      console.log('🔴 Missing refs for content-offset', {
        container: !!container,
        block: !!blockRef.current,
        overlay: !!blockOverlayRef.current,
      });
      return;
    }

    console.log('🟢 Setting up animations for content-offset', _key);

    // Run all animations within the isolated context
    runAnimations(() => {
      // BACKGROUND ANIMATION
      // Set initial state for the block's background overlay with bold color for debug
      gsap.set(blockOverlayRef.current, {
        opacity: 0,
        backgroundColor: 'rgba(255, 0, 0, 0.5)', // Start with a red background for visibility
      });

      console.log('🟢 Creating ScrollTrigger for background animation');

      // Create an animation that changes the background opacity based on scroll
      ScrollTrigger.create(
        createScrollTrigger(
          blockRef.current!,
          {
            start: 'top 70%', // Start when top of the section reaches 70% down the viewport
            end: 'top 20%', // End when top of the section reaches 20% down the viewport
            scrub: true, // Smooth animation that follows scroll position
            markers: showMarkers,
            onUpdate: (self: ScrollTrigger) => {
              // Update debug state
              setDebugProgress(self.progress);

              // Log progress
              if (self.progress > 0) {
                console.log(`🟡 ScrollTrigger progress: ${self.progress.toFixed(2)}`);
              }

              // Smoothly animate the background opacity based on scroll progress
              gsap.to(blockOverlayRef.current, {
                opacity: Math.min(1, self.progress * 1.5), // Faster fade-in (multiply by 1.5)
                duration: 0.1,
                overwrite: true,
              });
            },
          },
          0
        )
      );

      // IMAGE ANIMATIONS - Simple initial setup and parallax
      const imgContainer = imageContainerRef.current;
      const imgEl = imgContainer?.querySelector('img');

      if (imgContainer && imgEl) {
        // Set initial state for imgContainer
        gsap.set(imgContainer, { opacity: 0, y: 50 });

        // Simple fade-in and slight position animation for container
        gsap.to(imgContainer, {
          opacity: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: createScrollTrigger(
            container,
            {
              start: 'top 80%',
              end: 'top 30%',
              scrub: true,
              markers: showMarkers,
            },
            1
          ),
        });

        // Simple parallax for the image inside
        gsap.fromTo(
          imgEl,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: createScrollTrigger(
              container,
              {
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                markers: showMarkers,
              },
              2
            ),
          }
        );
      }

      // CONTENT ANIMATION - Simple vertical parallax only
      if (contentRef.current) {
        // Simple vertical parallax
        gsap.fromTo(
          contentRef.current,
          { y: 30 },
          {
            y: -60,
            ease: 'none',
            scrollTrigger: createScrollTrigger(
              container,
              {
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                markers: showMarkers,
              },
              3
            ),
          }
        );
      }

      // GRAPHIC ANIMATIONS - Already updated to be simple
      const graphicEl = graphicRef.current;
      if (graphicEl) {
        // Initial position - off-screen to the right
        gsap.set(graphicEl, {
          x: 200,
          opacity: 0,
        });

        // Simple right-to-left animation
        gsap.to(graphicEl, {
          x: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: createScrollTrigger(
            container,
            {
              start: 'center center', // Trigger at the center of the viewport
              end: 'bottom center',
              scrub: true,
              markers: showMarkers,
            },
            4
          ),
        });
      }
    });
  }, [
    _key,
    isDark,
    image?.asset?.url,
    graphic?.asset?.url,
    runAnimations,
    createScrollTrigger,
    showMarkers,
  ]);

  return (
    <div
      ref={blockRef}
      data-block-id={_key}
      className="featured-content-offset-block relative"
      id={`block-${_key}`}
    >
      {/* Debug indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed left-0 top-0 z-50 bg-black p-2 text-white">
          <div>Block: {_key}</div>
          <div>Progress: {debugProgress.toFixed(2)}</div>
        </div>
      )}

      {/* Block-specific background overlay */}
      <div
        ref={blockOverlayRef}
        className={cn(
          'will-change-opacity absolute inset-0 opacity-0 transition-opacity duration-300',
          'bg-red-500 bg-opacity-50' // Use a very visible color for debugging
        )}
        style={{
          zIndex: 0, // Increased z-index to make sure it's visible
        }}
        aria-hidden="true"
      />

      <SectionContainer className="overflow-x-clip">
        <div
          ref={containerRef}
          className="relative flex flex-col items-center justify-center overflow-visible py-32 md:min-h-[100vh] lg:min-h-[150vh]"
        >
          <div className="flex flex-col items-center gap-8 lg:w-full lg:flex-row">
            {/* IMAGE */}
            {image?.asset?.url && (
              <div ref={imageContainerRef} className="relative lg:z-0 lg:mr-[-10%] lg:w-2/3">
                <div className="overflow-hidden rounded-lg shadow-lg will-change-transform">
                  <Image
                    src={image.asset.url}
                    alt={image.alt || 'Featured content'}
                    width={800}
                    height={800}
                    className={cn(
                      'h-auto w-full object-cover will-change-transform',
                      isDark ? 'border border-slate-800' : ''
                    )}
                  />
                </div>
              </div>
            )}

            {/* CONTENT */}
            <div
              ref={contentRef}
              className="relative overflow-x-clip lg:z-20 lg:ml-[-10%] lg:w-1/2"
            >
              <div
                className={cn(
                  'z-10 flex flex-col items-start will-change-transform',
                  'lg:max-w-[450px] lg:rounded-md lg:p-12',
                  isDark
                    ? 'lg:bg-black/50 lg:backdrop-blur-md'
                    : 'lg:bg-background/10 lg:backdrop-blur-sm'
                )}
              >
                {tagLine && (
                  <TagLine title={tagLine} element="h2" className={isDark ? 'text-primary' : ''} />
                )}

                {title &&
                  createElement(
                    tagLine ? 'h3' : 'h2',
                    {
                      className: cn(
                        'my-4 font-semibold leading-[1.2] text-4xl',
                        isDark ? 'text-white' : ''
                      ),
                    },
                    title
                  )}

                {content && <PortableTextRenderer value={content} />}

                {/* LINKS */}
                {Array.isArray(links) && links.length > 0 && (
                  <div className="mt-6 flex flex-row gap-2">
                    {links.map((link: any, idx: number) => {
                      const key = link._id || link.title || idx;
                      if (link._type === 'reference' && link.slug) {
                        return (
                          <Button key={key} asChild>
                            <Link href={`/${link.slug.current}`}>{link.title || link.label}</Link>
                          </Button>
                        );
                      }
                      return (
                        <Button key={key} variant={link.buttonVariant} asChild>
                          <Link
                            href={link.href}
                            target={link.target ? '_blank' : undefined}
                            rel="noopener noreferrer"
                          >
                            {link.title || link.label}
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* GRAPHIC */}
            {graphic?.asset?.url && (
              <div ref={graphicRef} className="absolute bottom-[-10%] right-0 z-20 w-[60%]">
                <Image
                  src={graphic.asset.url}
                  alt={graphic.alt || 'Decorative graphic'}
                  className="h-auto w-full object-contain"
                  width={500}
                  height={500}
                />
              </div>
            )}
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
