import {
  Carousel,
  CarouselContent,
  CarouselCounter,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import SectionContainer, { ISectionPadding } from '@/components/ui/section-container';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { stegaClean } from 'next-sanity';
import Image from 'next/image';

const CAROUSEL_SIZES = {
  one: 'basis-full',
  two: 'basis-full md:basis-1/2',
  three: 'basis-full md:basis-1/2 lg:basis-1/3',
} as const;

const IMAGE_SIZES = {
  one: 'aspect-video',
  two: 'h-[30rem] md:h-[22rem] lg:h-[30rem] xl:h-[35rem]',
  three: 'h-[30rem] md:h-[20rem] xl:h-[25rem]',
} as const;

type CarouselSize = keyof typeof CAROUSEL_SIZES;

interface Carousel1Props {
  colorVariant?:
    | 'primary'
    | 'secondary'
    | 'card'
    | 'accent'
    | 'destructive'
    | 'background'
    | 'transparent';
  size?: CarouselSize;
  indicators?: 'none' | 'dots' | 'count';
  images?: Sanity.Image[];
  padding?: ISectionPadding;
}

export default function ExperienceCarousel({
  colorVariant = 'background',
  size = 'one',
  indicators = 'none',
  images,
  padding,
}: Carousel1Props) {
  const color = stegaClean(colorVariant);
  const stegaIndicators = stegaClean(indicators);

  return (
    <SectionContainer color={color} padding={padding} noContainer={true}>
      {images && images.length > 0 && (
        <Carousel className="relative rounded-md">
          <CarouselContent className="px-0">
            {images.map((image, index) => (
              <CarouselItem
                key={`${index}-${image.alt}`}
                className={CAROUSEL_SIZES[stegaClean(size)]}
              >
                {image && (
                  <div
                    className={cn(
                      'relative mx-auto overflow-hidden rounded-md',
                      IMAGE_SIZES[stegaClean(size)],
                      stegaClean(size) === 'one' ? 'w-full' : undefined
                    )}
                  >
                    <Image
                      className="object-cover"
                      src={
                        image.asset?._id === 'static'
                          ? '/images/placeholder.svg'
                          : urlFor(image.asset).url()
                      }
                      alt={image.alt || ''}
                      fill
                      placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
                      blurDataURL={image.asset?.metadata?.lqip || ''}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      quality={100}
                    />
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="secondary"
            className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          />
          <CarouselNext
            variant="secondary"
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2"
          />
          {stegaIndicators !== 'none' && (
            <div className="flex w-full justify-center">
              {stegaIndicators === 'dots' && <CarouselDots />}
              {stegaIndicators === 'count' && <CarouselCounter />}
            </div>
          )}
        </Carousel>
      )}
    </SectionContainer>
  );
}
