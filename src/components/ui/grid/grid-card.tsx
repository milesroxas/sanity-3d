import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { stegaClean } from 'next-sanity';
import Image, { ImageProps } from 'next/image';
import Link from 'next/link';
import React from 'react';

interface GridCardProps {
  color: 'primary' | 'secondary' | 'card' | 'accent' | 'destructive' | 'background' | 'transparent';
  style: 'default' | 'minimal' | 'accent';
  title: string;
  excerpt: string;
  image: Sanity.Image;
  link?: {
    title: string;
    href?: string;
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
  };
}

export default function GridCard({ color, title, excerpt, image, link, style }: GridCardProps) {
  const isMinimal = style === 'minimal';
  const hasLink = Boolean(link?.href);

  // Outer wrapper: <Link> when we have a href, otherwise plain <div>
  const Container: React.ElementType = hasLink ? Link : 'div';
  const containerProps = hasLink
    ? { href: link!.href, target: link!.target ? '_blank' : undefined }
    : {};

  // Styles for the outer wrapper
  const outerClasses = cn(
    'group flex w-full rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    !hasLink && 'cursor-default opacity-90'
  );

  // Styles for the card itself
  const cardClasses = cn(
    'flex w-full flex-col justify-between overflow-hidden rounded-md border transition ease-in-out',
    {
      'border-none bg-transparent p-2 text-left md:text-center': isMinimal,
      'p-4': !isMinimal,
    },
    color === 'primary' ? 'group-hover:border-primary-foreground/50' : 'group-hover:border-primary'
  );

  // Styles for the image container
  const imgContainerClasses = cn('relative mb-4 overflow-hidden rounded-sm', {
    'h-8 w-8 md:mx-auto': isMinimal,
    'h-[15rem] sm:h-[20rem] md:h-[25rem] lg:h-[9.5rem] xl:h-[12rem]': !isMinimal,
  });

  // Build next/image props for minimal vs default
  const imgProps: ImageProps = isMinimal
    ? {
        src: image.asset?._id === 'static' ? '/images/placeholder.svg' : urlFor(image.asset).url(),
        alt: image.alt || '',
        width: 32,
        height: 32,
        className: 'object-contain',
      }
    : {
        src: image.asset?._id === 'static' ? '/images/placeholder.svg' : urlFor(image.asset).url(),
        alt: image.alt || '',
        placeholder: image.asset?.metadata?.lqip ? 'blur' : undefined,
        blurDataURL: image.asset?.metadata?.lqip || '',
        fill: true,
        sizes: '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw',
        className: 'object-cover',
        quality: 100,
      };

  return (
    <Container {...containerProps} className={outerClasses}>
      <div className={cardClasses}>
        {image?.asset?._id && (
          <div className={imgContainerClasses}>
            <Image {...imgProps} />
          </div>
        )}

        <div className={cn(color === 'primary' && 'text-background')}>
          {title && (
            <div className="mb-2 flex items-center justify-between">
              <h3
                className={cn(
                  'w-full text-card-foreground', // ← w-full + text-center
                  isMinimal ? 'text-base font-bold' : 'text-xl font-semibold'
                )}
              >
                {title}
              </h3>
            </div>
          )}
          {excerpt && (
            <p className={cn('text-muted-foreground', isMinimal && 'text-sm')}>{excerpt}</p>
          )}
        </div>

        {hasLink && (
          <Button
            className={isMinimal ? 'mt-2' : 'mt-6'}
            size={isMinimal ? 'sm' : 'lg'}
            variant={stegaClean(link!.buttonVariant)}
            asChild
          >
            <div>{link!.title}</div>
          </Button>
        )}
      </div>
    </Container>
  );
}
