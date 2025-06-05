'use client';

import { ISectionContainerProps } from '@/components/ui/section-container';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { stegaClean } from 'next-sanity';
import Image from 'next/image';

export interface SplitImageProps {
  image: Sanity.Image;
  styleVariant: ISectionContainerProps['style'];
}

export default function SplitImage({ image, styleVariant }: Partial<SplitImageProps>) {
  const style = stegaClean(styleVariant);
  const isOffset = style === 'offset';

  return image && image.asset?._id ? (
    <div
      className={cn(
        'relative overflow-hidden rounded-sm will-change-transform',
        isOffset
          ? 'h-[25rem] w-full max-w-full rounded-md sm:h-[30rem] md:h-[30rem] lg:h-[calc(100%)] lg:shadow-lg'
          : 'h-[25rem] w-full sm:h-[30rem] md:h-[35rem] lg:h-[40rem]'
      )}
    >
      <Image
        src={urlFor(image.asset).url()}
        alt={image.alt || ''}
        placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
        blurDataURL={image?.asset?.metadata?.lqip || ''}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 35vw, (min-width: 640px) 50vw, 100vw"
        quality={100}
      />
    </div>
  ) : null;
}
