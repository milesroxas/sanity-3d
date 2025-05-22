'use client';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { LinkButtons } from '@/components/shared/link-button';
import { useBlockScrollTrigger } from '@/hooks/useBlockScrollTrigger';
import { urlFor } from '@/sanity/lib/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { PortableTextBlock } from 'next-sanity';
import Image from 'next/image';
import { useEffect } from 'react';

interface Hero1Props {
  tagLine: string;
  title: string;
  body: PortableTextBlock[];
  image: Sanity.Image;
  links: Sanity.Link[];
  _key: string;
}

export default function Hero1({ tagLine, title, body, image, links, _key }: Hero1Props) {
  const { blockRef, createScrollTrigger, runAnimations } = useBlockScrollTrigger(_key);

  useGSAP(
    () => {
      gsap.set(['.tagline', '.title', '.body', '.links'], { opacity: 0 });
      gsap.set('.image', { opacity: 0 });
      gsap.set('.image-content', {
        scale: 1.1,
        transformOrigin: 'center center',
        opacity: 0,
      });

      const tl = gsap.timeline({
        ease: 'power2.inOut',
        duration: 0.5,
      });

      tl.fromTo(
        '.tagline',
        {
          opacity: 0,
        },
        {
          opacity: 1,
        }
      );
      tl.fromTo(
        '.title',
        {
          opacity: 0,
        },
        {
          opacity: 1,
        },
        '-=0.3'
      );
      tl.fromTo(
        '.body',
        {
          opacity: 0,
        },
        {
          opacity: 1,
        },
        '-=0.3'
      );
      tl.fromTo(
        '.links',
        {
          opacity: 0,
        },
        {
          opacity: 1,
        },
        '-=0.3'
      );

      // Fade in the image container
      tl.to(
        '.image',
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.inOut',
        },
        '-=0.3'
      );

      // Scale the image content
      tl.to(
        '.image-content',
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power2.inOut',
        },
        '-=0.8'
      );
    },
    {
      scope: blockRef,
    }
  );

  useEffect(() => {
    const container = blockRef.current;
    if (!container || !blockRef.current) return;

    const imageContent = container.querySelector('.image-content');
    if (!imageContent) return;

    runAnimations(() => {
      gsap.fromTo(
        imageContent,
        {
          yPercent: -15,
        },
        {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: createScrollTrigger(
            container as HTMLElement,
            {
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
            0
          ),
        }
      );
    });
  }, [blockRef, createScrollTrigger, runAnimations]);

  return (
    <div className="flex w-full flex-col bg-accent md:min-h-[100vh] md:flex-row" ref={blockRef}>
      <div className="flex w-full flex-col justify-center p-12 md:w-1/2 md:p-16 lg:p-24">
        <div className="mx-auto max-w-xl">
          {tagLine && (
            <h1 className="tagline mb-2 text-muted-foreground md:text-base">{tagLine}</h1>
          )}

          {title && (
            <h2 className="title mb-6 text-3xl font-bold text-card-foreground md:text-4xl">
              {title}
            </h2>
          )}

          {body && (
            <PortableTextRenderer value={body} className="body mb-8 text-muted-foreground" />
          )}

          <LinkButtons links={links || []} containerClassName="mt-10 links" direction="row" />
        </div>
      </div>

      <div className="image relative w-full overflow-hidden md:w-1/2" ref={blockRef}>
        {image && image.asset?._id && (
          <Image
            className="image-content max-h-96 w-full object-cover md:h-full md:max-h-screen"
            src={urlFor(image.asset).url()}
            alt={image.alt || ''}
            width={image.asset?.metadata?.dimensions?.width || 800}
            height={image.asset?.metadata?.dimensions?.height || 800}
            placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
            blurDataURL={image?.asset?.metadata?.lqip || ''}
            quality={100}
          />
        )}
      </div>
    </div>
  );
}
