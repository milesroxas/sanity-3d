import { cn } from '@/lib/utils';
import type { PortableTextBlock } from '@portabletext/react';

import PortableTextRenderer from '@/components/portable-text-renderer';
import { Button } from '@/components/ui/button';
import SectionContainer, {
  ISectionContainerProps,
  ISectionPadding,
} from '@/components/ui/section-container';
import { stegaClean } from 'next-sanity';
import Link from 'next/link';

export default function Cta1({
  padding,
  direction,
  colorVariant,
  sectionWidth = 'default',
  stackAlign = 'left',
  tagLine,
  title,
  body,
  links,
}: Partial<{
  padding: ISectionPadding['padding'];
  direction: ISectionPadding['direction'];
  colorVariant: ISectionContainerProps['color'];
  stackAlign: 'left' | 'center';
  sectionWidth: 'default' | 'narrow';
  tagLine: string;
  title: string;
  body: PortableTextBlock[];
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
  const isNarrow = stegaClean(sectionWidth) === 'narrow';
  const align = stegaClean(stackAlign);
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
    <SectionContainer color={color} padding={sectionPadding}>
      <div
        className={cn(
          align === 'center' ? 'mx-auto max-w-[48rem] text-center' : undefined,
          isNarrow ? 'mx-auto max-w-[48rem]' : undefined
        )}
      >
        <div className={cn(color === 'primary' ? 'text-background' : undefined)}>
          {tagLine && (
            <h1 className="mb-4 leading-[0]">
              <span className="text-base font-semibold">{tagLine}</span>
            </h1>
          )}
          <h2 className="mb-4">{title}</h2>
          {body && <PortableTextRenderer value={body} />}
        </div>
        {links && links.length > 0 && (
          <div
            className={cn(
              'mt-10 flex flex-wrap gap-4',
              align === 'center' ? 'justify-center' : undefined
            )}
          >
            {links &&
              links.length > 0 &&
              links.map((link, index) => {
                if (!link) return null;
                if ((link as any)._type === 'reference' && (link as any).slug) {
                  const ref = link as { _id?: string; title?: string; slug?: { current: string } };
                  return (
                    <Button key={ref._id || ref.title || index} variant="default" asChild>
                      <Link href={`/${ref.slug?.current || ''}`}>{ref.title}</Link>
                    </Button>
                  );
                }
                return (
                  <Button
                    key={link.title || index}
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
    </SectionContainer>
  );
}
