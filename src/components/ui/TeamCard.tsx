'use client';
import PortableTextRenderer from '@/components/portable-text-renderer';
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
        'flex w-full cursor-pointer flex-col justify-between rounded-lg transition-all duration-300',
        isHovered ? 'translate-y-[-5px] transform shadow-lg' : 'shadow',
        className
      )}
      ref={cardRef}
      onClick={onClick}
    >
      <div className="overflow-hidden rounded-t-lg bg-muted">
        {image && image.asset?._id && (
          <div ref={imageContainerRef} className="image-container relative aspect-square">
            <Image
              ref={imageRef}
              src={urlFor(image.asset).url()}
              alt={image.alt || ''}
              placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
              blurDataURL={image?.asset?.metadata?.lqip || ''}
              fill
              style={{
                objectFit: 'cover',
                transformOrigin: 'center center',
                scale: 1.1,
              }}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              quality={100}
            />
          </div>
        )}
      </div>
      <div className="flex-grow p-4">
        {title && (
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-xl font-medium text-card-foreground">{title}</h3>
          </div>
        )}
        {excerpt && <p className="mb-2 text-sm text-muted-foreground">{excerpt}</p>}
        {email && (
          <p className="mb-3 text-sm text-primary">
            <a href={`mailto:${email}`} onClick={e => e.stopPropagation()}>
              {email}
            </a>
          </p>
        )}
        {bio && (
          <div className="max-h-24 overflow-hidden">
            {typeof bio === 'string' ? (
              <p className="line-clamp-3 text-sm text-muted-foreground">{bio}</p>
            ) : (
              <div className="line-clamp-3 text-sm text-muted-foreground">
                <PortableTextRenderer value={bio} variant="compact" />
              </div>
            )}
          </div>
        )}
        <div className="mt-3 text-sm font-medium text-primary">Click to view full profile</div>
      </div>
    </div>
  );
}
