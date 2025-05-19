'use client';

import PortableTextRenderer from '@/components/portable-text-renderer';
import { Button } from '@/components/ui/button';
import SectionContainer from '@/components/ui/section-container';
import TagLine from '@/components/ui/tag-line';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all'; // plugin registered globally
import { stegaClean } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';
import { createElement, useRef } from 'react';

export default function FeaturedContentOffset(props: any) {
  const { content, image, graphic, tagLine, title, links, testimonials, themeVariant } = props;
  const theme = stegaClean(themeVariant);
  const isDark = theme === 'dark';

  const sectionRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const graphicRef = useRef<HTMLDivElement>(null);
  const sectionContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const sectionContainer = sectionContainerRef.current;

      if (isDark) {
        // start light
        gsap.set(sectionContainer, { backgroundColor: 'rgba(250, 250, 249, 1)' });

        // hard-toggle dark ↔ light
        ScrollTrigger.create({
          trigger: section,
          start: 'top 45%',
          end: 'bottom 80%',
          onEnter: () =>
            gsap.to(sectionContainer, { backgroundColor: 'rgba(24, 24, 27, 1)', duration: 0.5 }),
          onLeave: () =>
            gsap.to(sectionContainer, { backgroundColor: 'rgba(250, 250, 249, 1)', duration: 0.5 }),
          onEnterBack: () =>
            gsap.to(sectionContainer, { backgroundColor: 'rgba(24, 24, 27, 1)', duration: 0.5 }),
          onLeaveBack: () =>
            gsap.to(sectionContainer, { backgroundColor: 'rgba(250, 250, 249, 1)', duration: 0.5 }),
          // markers: true,
        });
      }

      // — IMAGE ENTRANCE & PARALLAX INSIDE MASK —
      const imgEl = imageContainerRef.current?.querySelector('img');
      if (imgEl) {
        // fade + slide in
        gsap.fromTo(
          imageContainerRef.current!,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // parallax: move up/down within overflow-hidden container
        gsap.fromTo(
          imgEl,
          { yPercent: -20 },
          {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              scrub: 0.5,
              // markers: true,
            },
          }
        );
      }

      // — CONTENT PARALLAX (OPPOSITE TO IMAGE) —
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { y: 40 },
          {
            y: -120,
            ease: 'power1.inOut',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.7,
            },
          }
        );
      }

      // — GRAPHIC ENTRANCE & PARALLAX & ROTATION+SCALE —
      const graphicEl = graphicRef.current;
      if (graphicEl) {
        gsap.fromTo(
          graphicEl,
          { x: 200, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top -20%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 90%',
              end: 'bottom top',
              scrub: true,
            },
          })
          .to(graphicEl, { y: -30, rotationZ: -1, scale: 1.05, ease: 'none' }, 0);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isDark]);

  return (
    <SectionContainer ref={sectionContainerRef} theme={theme} className="overflow-x-clip">
      <div
        ref={sectionRef}
        className="relative flex flex-col items-center justify-center overflow-visible py-32 md:min-h-[100vh] lg:min-h-[150vh]"
      >
        <div className="flex flex-col items-center gap-8 lg:w-full lg:flex-row">
          {image && (
            <div ref={imageContainerRef} className="relative lg:z-0 lg:mr-[-10%] lg:w-2/3">
              <div className="overflow-hidden rounded-lg shadow-lg will-change-transform">
                <Image
                  src={image.asset?.url}
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

          <div ref={contentRef} className="relative overflow-x-clip lg:z-20 lg:ml-[-10%] lg:w-1/2">
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

              {links?.length > 0 && (
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
                        <a
                          href={link.href}
                          target={link.target ? '_blank' : undefined}
                          rel="noopener noreferrer"
                        >
                          {link.title || link.label}
                        </a>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {graphic && (
            <div ref={graphicRef} className="absolute bottom-[-10%] right-0 z-20 w-[60%]">
              <Image
                src={graphic.asset?.url}
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
  );
}
