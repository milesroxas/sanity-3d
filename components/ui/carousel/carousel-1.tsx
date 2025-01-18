import SectionContainer from "@/components/ui/section-container";
import { stegaClean } from "next-sanity";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
  CarouselCounter,
} from "@/components/ui/carousel";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";

const CAROUSEL_SIZES = {
  one: "basis-full",
  two: "basis-full md:basis-1/2",
  three: "basis-full md:basis-1/2 lg:basis-1/3",
} as const;

const IMAGE_SIZES = {
  one: "h-[30rem] sm:h-[40rem] lg:h-[31.25rem] xl:h-[35rem]",
  two: "h-[30rem] md:h-[22rem] lg:h-[30rem] xl:h-[35rem]",
  three: "h-[30rem] md:h-[20rem] xl:h-[25rem]",
} as const;

type CarouselSize = keyof typeof CAROUSEL_SIZES;

interface Carousel1Props {
  padding: {
    top: boolean;
    bottom: boolean;
  };
  colorVariant:
    | "primary"
    | "secondary"
    | "card"
    | "accent"
    | "destructive"
    | "background"
    | "transparent";
  size: CarouselSize;
  indicators: "none" | "dots" | "count";
  images?: Sanity.Image[];
}

export default function Carousel1({
  padding,
  colorVariant,
  size = "one",
  indicators = "none",
  images,
}: Partial<Carousel1Props>) {
  const color = stegaClean(colorVariant);
  const stegaIndicators = stegaClean(indicators);

  return (
    <SectionContainer color={color} padding={padding}>
      {images && images.length > 0 && (
        <Carousel>
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem
                key={`${index}-${image.alt}`}
                className={CAROUSEL_SIZES[stegaClean(size)]}
              >
                {image && (
                  <div
                    className={cn(
                      "relative mx-auto overflow-hidden rounded-2xl",
                      IMAGE_SIZES[stegaClean(size)],
                      stegaClean(size) === "one" ? "max-w-[35rem]" : undefined
                    )}
                  >
                    <Image
                      className="object-cover"
                      src={urlFor(image.asset).url()}
                      alt={image.alt || ""}
                      fill
                      placeholder={
                        image?.asset?.metadata?.lqip ? "blur" : undefined
                      }
                      blurDataURL={image.asset?.metadata?.lqip || ""}
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
            className="-left-3 md:-left-8 xl:-left-12"
          />
          <CarouselNext
            variant="secondary"
            className="-right-3 md:-right-8 xl:-right-12"
          />
          {stegaIndicators !== "none" && (
            <div className="w-full flex justify-center">
              {stegaIndicators === "dots" && <CarouselDots />}
              {stegaIndicators === "count" && <CarouselCounter />}
            </div>
          )}
        </Carousel>
      )}
    </SectionContainer>
  );
}
