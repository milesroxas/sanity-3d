'use client';

import PortableTextRenderer from '@/components/portable-text-renderer';
import { Button } from '@/components/ui/button';
import SectionContainer from '@/components/ui/section-container';
import TagLine from '@/components/ui/tag-line';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { stegaClean } from 'next-sanity';
import Link from 'next/link';
import { createElement, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedContentOffset(props: any) {
  const { content, image, graphic, tagLine, title, links, testimonials, themeVariant } = props;
  const theme = stegaClean(themeVariant);
  const isDarkTheme = theme === 'dark';
  const isAccentTheme = theme === 'accent';

  const sectionRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const graphicRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const sectionEl = section?.closest('.bg-slate-950');
      if (!section) return;

      // — kill any old content-offset triggers —
      ScrollTrigger.getAll()
        .filter(t => t.vars.id?.startsWith('content-offset-'))
        .forEach(t => t.kill());

      // — BACKGROUND TOGGLE (dark/light) —
      if (sectionEl && isDarkTheme) {
        gsap.set(sectionEl, { backgroundColor: 'rgba(255,255,255,1)' });

        // go dark when top of section hits top of viewport
        gsap.to(sectionEl, {
          backgroundColor: 'rgba(17,24,39,1)',
          duration: 1,
          ease: 'power1.out',
          scrollTrigger: {
            id: 'content-offset-bg-dark',
            trigger: section,
            start: 'top 45%',
            toggleActions: 'play none none reverse',
            // markers: true,
          },
        });

        // go light when bottom of section hits bottom of viewport
        gsap.to(sectionEl, {
          backgroundColor: 'rgba(255,255,255,1)',
          duration: 1,
          ease: 'power1.out',
          scrollTrigger: {
            id: 'content-offset-bg-light',
            trigger: section,
            start: 'bottom 80%',
            toggleActions: 'play none none reverse',
            // markers: true,
          },
        });
      }

      // — IMAGE ENTRANCE & PARALLAX & ROTATION —
      const imgContainer = imageContainerRef.current;
      if (imgContainer) {
        // fade + slide in
        gsap.fromTo(
          imgContainer,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              id: 'content-offset-img-entrance',
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
              // markers: true,
            },
          }
        );

        const imgEl = imgContainer.querySelector('img');
        if (imgEl) {
          // parallax up/down
          gsap.to(imgEl, {
            y: 40,
            ease: 'none',
            scrollTrigger: {
              id: 'content-offset-img-parallax',
              trigger: section,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: true,
              // markers: true,
            },
          });

          // subtle rotation
          gsap.to(imgEl, {
            rotationZ: 1,
            ease: 'none',
            scrollTrigger: {
              id: 'content-offset-img-rotation',
              trigger: section,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: true,
              // markers: true,
            },
          });
        }
      }

      // — GRAPHIC ENTRANCE & PARALLAX & ROTATION+SCALE —
      const graphicEl = graphicRef.current;
      if (graphicEl) {
        // slide in from right
        gsap.fromTo(
          graphicEl,
          { x: 100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              id: 'content-offset-graphic-entrance',
              trigger: section,
              start: 'top 20%',
              toggleActions: 'play none none reverse',
              // markers: true,
            },
          }
        );

        // parallax up
        gsap.to(graphicEl, {
          y: -30,
          ease: 'none',
          scrollTrigger: {
            id: 'content-offset-graphic-parallax',
            trigger: section,
            start: 'top 90%',
            end: 'bottom top',
            scrub: true,
            // markers: true,
          },
        });

        // rotate & scale
        gsap.to(graphicEl, {
          rotationZ: -1,
          scale: 1.02,
          ease: 'none',
          scrollTrigger: {
            id: 'content-offset-graphic-rotation',
            trigger: section,
            start: 'top 90%',
            end: 'bottom top',
            scrub: true,
            // markers: true,
          },
        });
      }

      // — CLEANUP —
      return () => {
        ScrollTrigger.getAll()
          .filter(t => t.vars.id?.startsWith('content-offset-'))
          .forEach(t => t.kill());
      };
    },
    { scope: sectionRef }
  );

  return (
    <SectionContainer theme={theme}>
      <div
        ref={sectionRef}
        className="relative flex min-h-[150vh] flex-col items-center justify-center overflow-visible py-32 align-middle"
      >
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {image && (
            <div ref={imageContainerRef} className="relative lg:z-0 lg:ml-0 lg:mr-[-10%]">
              <div className="overflow-hidden rounded-lg shadow-lg will-change-transform">
                <img
                  src={image.asset?.url}
                  alt={image.alt || 'Featured content'}
                  className={cn(
                    'h-auto w-full scale-[1.15] will-change-transform',
                    isDarkTheme ? 'border border-slate-800' : ''
                  )}
                />
              </div>
            </div>
          )}
          <div className="relative overflow-x-clip lg:z-20 lg:ml-[-10%]">
            <div
              ref={contentRef}
              className={cn(
                'z-10 flex flex-col items-start will-change-transform',
                'lg:max-w-[500px] lg:rounded-md lg:p-8',
                isDarkTheme
                  ? 'lg:bg-black/40 lg:backdrop-blur-sm'
                  : 'lg:bg-background/10 lg:backdrop-blur-sm'
              )}
            >
              {tagLine && (
                <TagLine
                  title={tagLine}
                  element="h2"
                  className={isDarkTheme ? 'text-primary' : undefined}
                />
              )}

              {title &&
                createElement(
                  tagLine ? 'h3' : 'h2',
                  {
                    className: cn(
                      'my-4 font-semibold leading-[1.2] text-4xl',
                      isDarkTheme ? 'text-white' : ''
                    ),
                  },
                  title
                )}

              {content && <PortableTextRenderer value={content} />}

              {links && links.length > 0 && (
                <div className="mt-6 flex flex-col space-y-2">
                  {links.map((link: any, idx: number) => {
                    if (!link) return null;
                    const key = link._id || link.title || idx;
                    if (link._type === 'reference' && link.slug) {
                      return (
                        <Button key={key} className="mt-2" variant="default" size="lg" asChild>
                          <Link href={`/${link.slug.current || ''}`}>
                            {link.title || link.label}
                          </Link>
                        </Button>
                      );
                    }
                    const variant = idx === 0 ? 'default' : 'outline';
                    return (
                      <Button key={key} className="mt-2" variant={variant as any} size="lg" asChild>
                        <a
                          href={link.url}
                          target={link.target ? '_blank' : undefined}
                          rel="noopener noreferrer"
                        >
                          {link.label}
                        </a>
                      </Button>
                    );
                  })}
                </div>
              )}

              {testimonials && testimonials.length > 0 && (
                <div className="mt-6 flex flex-col space-y-4">
                  {testimonials.map((t: any, i: number) => (
                    <div key={i} className="flex items-center space-x-3">
                      {t.image && (
                        <img
                          src={t.image.asset?.url}
                          alt={t.name}
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                      <div>
                        <p className={cn('font-semibold', isDarkTheme ? 'text-white' : '')}>
                          {t.name}
                        </p>
                        <p
                          className={cn('text-sm', isDarkTheme ? 'text-gray-400' : 'text-gray-600')}
                        >
                          {t.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {graphic && (
              <div
                ref={graphicRef}
                className="graphic-element absolute bottom-[-25%] right-0 z-20 w-[50%] max-w-[450px]"
              >
                <img
                  src={graphic.asset?.url}
                  alt={graphic.alt || 'Decorative graphic'}
                  className="h-auto w-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
