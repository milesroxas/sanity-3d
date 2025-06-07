import { LinkButtons } from '@/components/shared/link-button';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import Image, { ImageProps } from 'next/image';
import Link from 'next/link';
import React from 'react';

interface GridCardProps {
  color: 'primary' | 'secondary' | 'card' | 'accent' | 'destructive' | 'background' | 'transparent';
  style: 'default' | 'minimal' | 'accent' | 'data';
  title: string;
  excerpt: string;
  image?: Sanity.Image;
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

export default function GridCard({
  color,
  title,
  excerpt,
  image,
  link,
  style = 'default',
}: GridCardProps) {
  const hasLink = Boolean(link?.href);

  // Container component and props
  const Container: React.ElementType = hasLink ? Link : 'div';
  const containerProps = hasLink
    ? { href: link?.href, target: link?.target ? '_blank' : undefined }
    : {};

  // Define types for variant configuration to ensure type safety
  type VariantConfig = {
    card: string;
    image: {
      container: string;
      props: Partial<ImageProps>;
    };
    title: string;
    titleContainer?: string;
    excerpt: string;
    button: string;
    buttonSize: 'sm' | 'default' | 'lg';
  };

  // Style variants definition
  const styleVariants: Record<GridCardProps['style'], VariantConfig> = {
    default: {
      card: 'p-4',
      image: {
        container:
          'relative mb-4 overflow-hidden rounded-sm h-[15rem] sm:h-[20rem] md:h-[25rem] lg:h-[9.5rem] xl:h-[12rem]',
        props: {
          fill: true,
          sizes: '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw',
          className: 'object-cover',
          quality: 100,
          placeholder: image?.asset?.metadata?.lqip ? 'blur' : undefined,
          blurDataURL: image?.asset?.metadata?.lqip || '',
        },
      },
      title: 'text-xl font-semibold text-card-foreground',
      excerpt: 'text-muted-foreground',
      button: 'mt-6',
      buttonSize: 'lg',
    },
    minimal: {
      card: 'border-none bg-transparent p-2  md:text-center',
      image: {
        container: 'relative mb-4 overflow-hidden rounded-sm h-8 w-8 md:mx-auto',
        props: {
          width: 32,
          height: 32,
          className: 'object-contain',
        },
      },
      title: 'text-base font-bold text-card-foreground ',
      excerpt: 'text-muted-foreground text-sm',
      button: 'mt-2',
      buttonSize: 'sm',
    },
    data: {
      card: 'border-none bg-transparent p-2 text-left',
      image: {
        container: 'relative overflow-hidden float-right mb-2 ml-4 h-16 w-16 rounded-full',
        props: {
          width: 64,
          height: 64,
          className: 'object-cover rounded-full',
        },
      },
      title: 'text-4xl font-extrabold text-card-foreground',
      titleContainer: 'pb-2',
      excerpt: 'text-muted-foreground leading-relaxed font-bold text-md',
      button: 'mt-6 self-end',
      buttonSize: 'default',
    },
    accent: {
      // Placeholder for future 'accent' style implementation
      // Fallback to default for now
      card: 'p-4',
      image: {
        container:
          'relative mb-4 overflow-hidden rounded-sm h-[15rem] sm:h-[20rem] md:h-[25rem] lg:h-[9.5rem] xl:h-[12rem]',
        props: {
          fill: true,
          sizes: '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw',
          className: 'object-cover',
          quality: 100,
          placeholder: image?.asset?.metadata?.lqip ? 'blur' : undefined,
          blurDataURL: image?.asset?.metadata?.lqip || '',
        },
      },
      title: 'text-xl font-semibold text-card-foreground',
      excerpt: 'text-muted-foreground',
      button: 'mt-6',
      buttonSize: 'lg',
    },
  };

  // Selecting the active variant
  const variant = styleVariants[style] || styleVariants.default;

  // Common classes
  const outerClasses = cn(
    'group flex w-full rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    !hasLink && 'cursor-default opacity-90'
  );

  // Card classes with conditional hover effect
  const cardClasses = cn(
    'flex w-full flex-col justify-between overflow-hidden rounded-md border transition ease-in-out',
    variant.card,
    style !== 'data' &&
      (color === 'primary'
        ? 'group-hover:border-primary-foreground/50'
        : 'group-hover:border-primary')
  );

  // Image source handling
  const imgSrc =
    image?.asset?._id === 'static'
      ? '/images/placeholder.svg'
      : image?.asset
        ? urlFor(image.asset).url()
        : '/images/placeholder.svg';

  // Base image props
  const baseImageProps: Partial<ImageProps> = {
    src: imgSrc,
    alt: image?.alt || 'decorative image',
    width: 500,
    height: 500,
  };

  // Get image props based on variant - properly merged for type safety
  const imgProps: ImageProps = {
    ...baseImageProps,
    ...variant.image.props,
    alt: image?.alt || 'decorative image',
  } as ImageProps;

  return (
    <Container {...containerProps} className={outerClasses}>
      <div className={cardClasses}>
        {image?.asset?._id && (
          <div className={variant.image.container}>
            <Image {...imgProps} alt={image?.alt || 'decorative image'} />
          </div>
        )}

        <div className={cn(color === 'primary' && style !== 'data' && 'text-background')}>
          {title && (
            <div className={cn('mb-2', variant.titleContainer)}>
              <h3 className={variant.title}>{title}</h3>
            </div>
          )}
          {excerpt && <p className={variant.excerpt}>{excerpt}</p>}
        </div>

        {hasLink && link && (
          <LinkButtons
            links={[link as any]}
            containerClassName="mt-6"
            direction="row"
            variant={link.buttonVariant as any}
          />
        )}
      </div>
    </Container>
  );
}
