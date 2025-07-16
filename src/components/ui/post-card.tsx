import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';

export default function PostCard({
  className,
  title,
  excerpt,
  image,
}: Partial<{
  className: string;
  title: string;
  excerpt: string;
  image: Sanity.Image;
}>) {
  return (
    <div
      className={cn(
        'group flex w-full flex-col justify-between overflow-hidden rounded-md border p-4 transition ease-in-out hover:border-primary',
        className
      )}
    >
      <div className="flex flex-col">
        {image && image.asset?._id && (
          <div className="relative mb-4 h-[15rem] overflow-hidden rounded-sm sm:h-[20rem] md:h-[25rem] lg:h-[9.5rem] xl:h-[12rem]">
            <Image
              src={urlFor(image.asset).url()}
              alt={image.alt || ''}
              placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
              blurDataURL={image?.asset?.metadata?.lqip || ''}
              fill
              style={{
                objectFit: 'cover',
              }}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              quality={100}
            />
          </div>
        )}
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[1.5rem] font-bold leading-[1.2]">{title}</h3>
          </div>
        )}
        {excerpt && <p className="text-sm text-muted-foreground">{excerpt}</p>}
      </div>
    </div>
  );
}
