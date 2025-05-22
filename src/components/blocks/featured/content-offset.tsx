'use client';

import PortableTextRenderer from '@/components/portable-text-renderer';
import { LinkButtons } from '@/components/shared/link-button';
import SectionContainer from '@/components/ui/section-container';
import TagLine from '@/components/ui/tag-line';
import { useBlockScrollTrigger } from '@/hooks/useBlockScrollTrigger';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { stegaClean } from 'next-sanity';
import Image from 'next/image';
import { createElement, useEffect, useLayoutEffect, useRef } from 'react';

interface FeaturedContentOffsetProps {
  content?: any;
  image?: Sanity.Image;
  graphic?: Sanity.Image;
  tagLine?: string;
  title?: string;
  links?: Sanity.Link[];
  testimonials?: any[];
  themeVariant?: string;
  _key?: string;
}

export default function FeaturedContentOffset(props: FeaturedContentOffsetProps) {
  const { content, image, graphic, tagLine, title, links, themeVariant, _key } = props;

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

  // Only show markers in development
  const showMarkers = process.env.NODE_ENV === 'development';

  // Register the plugin just to be safe
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Set up animations when the component mounts
  useEffect(() => {
    // Make sure refs are ready
    const container = containerRef.current;
    if (!container || !blockRef.current || !blockOverlayRef.current) return;

    // Run all animations within the isolated context
    runAnimations(() => {
      // SIMPLIFIED BACKGROUND ANIMATION
      // Set initial state for the background overlay (hidden)
      gsap.set(blockOverlayRef.current, { opacity: 0 });

      gsap.fromTo(
        blockOverlayRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: createScrollTrigger(
            blockRef.current!,
            {
              start: 'top 10%', // Adjusted for smoother entry
              end: 'top 0%', // Expanded trigger zone
              scrub: 0.5, // Add smoothing with scrub - key fix!
              markers: showMarkers,
            },
            0
          ),
        }
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
        });

        // Simple right-to-left animation
        gsap.to(graphicEl, {
          x: 0,
          ease: 'power2.inOut',
          duration: 1,
          scrollTrigger: createScrollTrigger(
            container,
            {
              start: 'center center', // Trigger at the center of the viewport
              end: 'bottom center',
            },
            4
          ),
        });
      }
    });
  }, [
    _key,
    isDark,
    image?.asset?._id,
    graphic?.asset?._id,
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
      {/* Block-specific background overlay */}
      <div
        ref={blockOverlayRef}
        className={cn(
          'will-change-opacity absolute inset-0',
          isDark ? 'bg-zinc-900' : 'bg-zinc-900'
        )}
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />

      <SectionContainer className="overflow-x-clip">
        <div
          ref={containerRef}
          className="relative flex flex-col items-center justify-center overflow-visible py-32 md:min-h-[100vh] lg:min-h-[120vh]"
        >
          <div className="flex flex-col items-center gap-8 lg:w-full lg:flex-row">
            {/* IMAGE */}
            {image?.asset?._id && (
              <div ref={imageContainerRef} className="relative lg:z-0 lg:mr-[-10%] lg:w-2/3">
                <div className="overflow-hidden rounded-lg shadow-lg will-change-transform">
                  <Image
                    src={urlFor(image.asset).url()}
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

                {content && <PortableTextRenderer value={content} className="text-white" />}

                {/* LINKS - Now using reusable component */}
                <LinkButtons links={links || []} containerClassName="mt-6" direction="row" />
              </div>
            </div>

            {/* GRAPHIC */}
            {graphic?.asset?._id && (
              <div ref={graphicRef} className="absolute bottom-[-10%] right-0 z-20 w-[60%]">
                <Image
                  src={urlFor(graphic.asset).url()}
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
