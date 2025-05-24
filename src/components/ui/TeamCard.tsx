'use client';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import { useRef } from 'react';

export default function TeamCard({
  className,
  title,
  excerpt,
  image,
}: Partial<{
  className: string;
  title: string;
  excerpt: string;
  image: any;
}>) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cardElement = cardRef.current;
      const imgContainer = imageContainerRef.current;

      if (!cardElement || !imgContainer) {
        return;
      }

      const imageElementToAnimate = imgContainer.querySelector('img');

      if (!imageElementToAnimate) {
        return;
      }

      const tl = gsap.timeline({ paused: true });
      tl.to(imageElementToAnimate, {
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.inOut',
      });

      const handleMouseEnter = () => {
        tl.play();
      };
      const handleMouseLeave = () => {
        tl.reverse();
      };

      cardElement.addEventListener('mouseenter', handleMouseEnter);
      cardElement.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        if (cardElement) {
          cardElement.removeEventListener('mouseenter', handleMouseEnter);
          cardElement.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    },
    {
      scope: cardRef,
      dependencies: [image],
      revertOnUpdate: true,
    }
  );

  return (
    <div
      className={cn('group flex w-full flex-col justify-between rounded-md', className)}
      ref={cardRef}
    >
      <div className="flex flex-col">
        {image && image.asset?._id && (
          <div
            ref={imageContainerRef}
            className="image-container relative mb-4 aspect-square overflow-hidden rounded-md"
          >
            <Image
              src={urlFor(image.asset).url()}
              alt={image.alt || ''}
              placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
              blurDataURL={image?.asset?.metadata?.lqip || ''}
              fill
              style={{
                objectFit: 'cover',
              }}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              quality={100}
            />
          </div>
        )}
        {title && (
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[1.5rem] font-bold leading-[1.2]">{title}</h3>
          </div>
        )}
        {excerpt && <p>{excerpt}</p>}
      </div>
    </div>
  );
}
