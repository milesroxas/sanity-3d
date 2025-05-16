import PortableTextRenderer from '@/components/portable-text-renderer';
import { Button } from '@/components/ui/button';
import { urlFor } from '@/sanity/lib/image';
import { PortableTextBlock, stegaClean } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero1({
  tagLine,
  title,
  body,
  image,
  links,
}: Partial<{
  tagLine: string;
  title: string;
  body: PortableTextBlock[];
  image: Sanity.Image;
  links: {
    title: string;
    href: string;
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
  }[];
}>) {
  return (
    <div className="flex w-full flex-col bg-accent md:min-h-[100vh] md:flex-row">
      {/* Left Content */}
      <div className="flex w-full flex-col justify-center p-12 md:w-1/2 md:p-16 lg:p-24">
        <div className="mx-auto max-w-xl">
          {tagLine && <h1 className="mb-2 text-muted-foreground md:text-base">{tagLine}</h1>}

          {title && (
            <h2 className="mb-6 text-3xl font-bold text-card-foreground md:text-4xl">{title}</h2>
          )}

          {body && <PortableTextRenderer value={body} className="mb-8 text-muted-foreground" />}

          {links && links.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-4">
              {links.map(link => {
                if (!link) return null;
                // Reference type
                if ((link as any)._type === 'reference' && (link as any).slug) {
                  const ref = link as { _id?: string; title?: string; slug?: { current: string } };
                  return (
                    <Button key={ref._id || ref.title} variant="default" asChild>
                      <Link href={`/${ref.slug?.current || ''}`}>{ref.title}</Link>
                    </Button>
                  );
                }
                // Custom link type
                return (
                  <Button
                    key={link.title}
                    variant={stegaClean((link as any)?.buttonVariant)}
                    asChild
                  >
                    <Link
                      href={(link as any).href as string}
                      target={(link as any).target ? '_blank' : undefined}
                      rel={(link as any).target ? 'noopener' : undefined}
                    >
                      {link.title}
                    </Link>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Right Image */}

      <div className="relative w-full md:w-1/2">
        {image && image.asset?._id && (
          <Image
            className="max-h-96 w-full object-cover md:h-full md:max-h-screen"
            src={urlFor(image.asset).url()}
            alt={image.alt || ''}
            width={image.asset?.metadata?.dimensions?.width || 800}
            height={image.asset?.metadata?.dimensions?.height || 800}
            placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
            blurDataURL={image?.asset?.metadata?.lqip || ''}
            quality={100}
          />
        )}
      </div>
    </div>
  );
}
