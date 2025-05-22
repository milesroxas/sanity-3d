import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface GridPostProps {
  color: 'primary' | 'secondary' | 'card' | 'accent' | 'destructive' | 'background' | 'transparent';
  title: string;
  slug: Sanity.Post['slug'];
  categories: Sanity.Category[];
  excerpt: string;
  image: Sanity.Image;
}

export default function GridPost({
  color,
  title,
  slug,
  excerpt,
  image,
  categories,
}: GridPostProps) {
  return (
    <Link
      key={title}
      className="group flex w-full rounded-3xl ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      href={slug.current ? `/blog/${slug.current}` : '#'}
    >
      <div
        className={cn(
          'group flex w-full flex-col justify-between overflow-hidden rounded-md border p-4 transition ease-in-out hover:border-primary',
          color === 'primary'
            ? 'group-hover:border-primary-foreground/50'
            : 'group-hover:border-primary'
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
          {categories && categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge key={category._id} color="primary">
                  {category.title}
                </Badge>
              ))}
            </div>
          )}
          {excerpt && <p>{excerpt}</p>}
        </div>
        <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-full border group-hover:border-primary xl:mt-6">
          <ChevronRight className="text-border group-hover:text-primary" size={24} />
        </div>
      </div>
    </Link>
  );
}
