'use client';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import { useRef, useState } from 'react';

export default function TeamCard({
  className,
  title,
  excerpt,
  image,
  onClick,
  size = 'default',
}: Partial<{
  className: string;
  title: string;
  excerpt: string;
  image: any;
  bio: any;
  email: string;
  onClick?: () => void;
  size?: 'default' | 'small';
}>) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isSmall = size === 'small';

  useGSAP(
    () => {
      const cardElement = cardRef.current;
      const imageElementToAnimate = imageRef.current;
      const titleElement = titleRef.current;

      if (!cardElement || !imageElementToAnimate || !titleElement) {
        return;
      }

      const tl = gsap.timeline({ paused: true });
      tl.to(
        imageElementToAnimate,
        {
          scale: 1.05,
          duration: 0.4,
          ease: 'power2.out',
        },
        0
      ).to(
        titleElement,
        {
          color: '#16A249',
          duration: 0.4,
          ease: 'power2.inOut',
        },
        0
      );

      const handleMouseEnter = () => {
        tl.play();
        setIsHovered(true);
      };
      const handleMouseLeave = () => {
        tl.reverse();
        setIsHovered(false);
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
      className={cn(
        'flex w-full cursor-pointer flex-col justify-between transition-all duration-300',
        className
      )}
      ref={cardRef}
      onClick={onClick}
    >
      <div className={cn('overflow-hidden rounded-md bg-muted', isSmall ? 'mb-1.5' : 'mb-2')}>
        {image && image.asset?._id && (
          <div
            ref={imageContainerRef}
            className={cn(
              'image-container relative aspect-square bg-slate-100',
              isSmall && 'max-w-[200px]'
            )}
          >
            <Image
              ref={imageRef}
              src={urlFor(image.asset).url()}
              alt={image.alt || ''}
              placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
              blurDataURL={image?.asset?.metadata?.lqip || ''}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              quality={100}
            />
          </div>
        )}
      </div>
      <div>
        {title && (
          <div className="flex items-center justify-between">
            <h3
              ref={titleRef}
              className={cn('font-medium text-card-foreground', isSmall ? 'text-base' : 'text-xl')}
            >
              {title}
            </h3>
          </div>
        )}
        {excerpt && <p className={cn(isSmall ? 'mb-1.5 text-xs' : 'mb-2 text-sm')}>{excerpt}</p>}
      </div>
    </div>
  );
}
