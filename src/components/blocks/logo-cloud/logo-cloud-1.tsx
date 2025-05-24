'use client';
import SectionContainer, { ISectionPadding } from '@/components/ui/section-container';
import { urlFor } from '@/sanity/lib/image';
import { motion } from 'motion/react';
import { stegaClean } from 'next-sanity';
import Image from 'next/image';
import { Fragment } from 'react';

interface LogoCloud1Props {
  padding: ISectionPadding['padding'];
  direction: ISectionPadding['direction'];
  colorVariant:
    | 'primary'
    | 'secondary'
    | 'card'
    | 'accent'
    | 'destructive'
    | 'background'
    | 'transparent';
  title: string;
  images: Sanity.Image[];
}

export default function LogoCloud1({
  padding,
  direction,
  colorVariant,
  title,
  images,
}: Partial<LogoCloud1Props>) {
  const color = stegaClean(colorVariant);

  // Combine padding and direction into ISectionPadding object
  const sectionPadding: ISectionPadding | undefined =
    padding && direction
      ? {
          padding: stegaClean(padding),
          direction: stegaClean(direction),
        }
      : undefined;

  return (
    <SectionContainer color={color} padding={sectionPadding} className="overflow-hidden">
      {title && (
        <h2 className="mb-4 text-center text-lg font-semibold uppercase tracking-tighter text-card-foreground">
          {title}
        </h2>
      )}
      <div className="relative flex overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-10 before:bg-gradient-to-r before:from-background before:to-transparent before:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-10 after:bg-gradient-to-l after:from-background after:to-transparent after:content-['']">
        <motion.div
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
          }}
          animate={{
            x: ['0%', '-50%'],
          }}
          className="flex w-max gap-24 pr-24"
        >
          {[...new Array(2)].map((_, arrayIndex) => (
            <Fragment key={arrayIndex}>
              {images?.map((image, index) => (
                <div
                  key={`${image.asset._id}-${arrayIndex}-${index}`}
                  className="flex h-24 w-24 flex-shrink-0 items-center justify-center"
                >
                  <Image
                    src={urlFor(image.asset).url()}
                    alt={image.alt || ''}
                    placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
                    blurDataURL={image?.asset?.metadata?.lqip || ''}
                    width={image.asset?.metadata?.dimensions?.width || 220}
                    height={image?.asset?.metadata?.dimensions?.height || 90}
                  />
                </div>
              ))}
            </Fragment>
          ))}
        </motion.div>
      </div>
    </SectionContainer>
  );
}
