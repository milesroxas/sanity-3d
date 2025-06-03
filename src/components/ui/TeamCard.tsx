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
  bio,
  email,
  onClick,
}: Partial<{
  className: string;
  title: string;
  excerpt: string;
  image: any;
  bio: any;
  email: string;
  onClick?: () => void;
}>) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useGSAP(
    () => {
      const cardElement = cardRef.current;
      const imgContainer = imageRef.current;

      if (!cardElement || !imgContainer) {
        return;
      }

      const imageElementToAnimate = imageRef.current;

      if (!imageElementToAnimate) {
        return;
      }

      const tl = gsap.timeline({ paused: true });
      tl.to(imageElementToAnimate, {
        scale: 1.2,
        duration: 0.3,
        ease: 'power2.inOut',
      });

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
      <div className="mb-2 rounded-md bg-muted">
        {image && image.asset?._id && (
          <div
            ref={imageContainerRef}
            className="image-container relative aspect-square bg-slate-100"
          >
            <Image
              ref={imageRef}
              src={urlFor(image.asset).url()}
              alt={image.alt || ''}
              placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
              blurDataURL={image?.asset?.metadata?.lqip || ''}
              fill
              style={{
                objectFit: 'cover',
                transformOrigin: 'bottom left',
                scale: 1.1,
              }}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              quality={100}
            />
          </div>
        )}
      </div>
      <div>
        {title && (
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium text-card-foreground">{title}</h3>
          </div>
        )}
        {excerpt && <p className="mb-2 text-sm">{excerpt}</p>}
      </div>
    </div>
  );
}
