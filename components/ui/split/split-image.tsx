import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export interface SplitImageProps {
  image: Sanity.Image;
}

export default function SplitImage({ image }: Partial<SplitImageProps>) {
  return image && image.asset?._id ? (
    <div className="relative h-[25rem] sm:h-[30rem] md:h-[25rem] lg:h-full rounded-sm overflow-hidden">
      <Image
        src={urlFor(image.asset).url()}
        alt={image.alt || ""}
        placeholder={image?.asset?.metadata?.lqip ? "blur" : undefined}
        blurDataURL={image?.asset?.metadata?.lqip || ""}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        quality={100}
      />
    </div>
  ) : null;
}
