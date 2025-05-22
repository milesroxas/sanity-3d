'use client';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { Button } from '@/components/ui/button';
import { useBlockScrollTrigger } from '@/hooks/useBlockScrollTrigger';
import { urlFor } from '@/sanity/lib/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { PortableTextBlock, stegaClean } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
export default function Hero1({
  tagLine,
  title,
  body,
  image,
  links,
  _key,
}: Partial<{
  _key: string;
  tagLine: string;
  title: string;
  body: PortableTextBlock[];
  image: Sanity.Image;
  links: {
    title: string;
    href: string;
    target?: boolean;
    buttonVariant:
      | 'default'
      | 'secondary'
      | 'link'
      | 'destructive'
      | 'outline'
      | 'ghost'
      | null
      | undefined;
  }[];
}>) {
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

          {links && links.length > 0 && (
            <div className="links mt-10 flex flex-wrap gap-4">
              {links.map(link => {
                if (!link) return null;

                if ((link as any)._type === 'reference' && (link as any).slug) {
                  const ref = link as { _id?: string; title?: string; slug?: { current: string } };
                  return (
                    <Button key={ref._id || ref.title} variant="default" asChild>
                      <Link href={`/${ref.slug?.current || ''}`}>{ref.title}</Link>
                    </Button>
                  );
                }
                // Custom link type
                return (
                  <Button
                    key={link.title}
                    variant={stegaClean((link as any)?.buttonVariant)}
                    asChild
                    className="link"
                  >
                    <Link
                      href={(link as any).href as string}
                      target={(link as any).target ? '_blank' : undefined}
                      rel={(link as any).target ? 'noopener' : undefined}
                    >
                      {link.title}
                    </Link>
                  </Button>
                );
              })}
            </div>
          )}
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
