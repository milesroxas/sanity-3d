import { cn } from '@/lib/utils';
import type { PortableTextBlock } from '@portabletext/react';

import PortableTextRenderer from '@/components/portable-text-renderer';
import { LinkButtons } from '@/components/shared/link-button';
import SectionContainer, {
  ISectionContainerProps,
  ISectionPadding,
} from '@/components/ui/section-container';
import { stegaClean } from 'next-sanity';

interface Cta1Props {
  padding: ISectionPadding['padding'];
  direction: ISectionPadding['direction'];
  colorVariant: ISectionContainerProps['color'];
  stackAlign: 'left' | 'center';
  sectionWidth: 'default' | 'narrow';
  tagLine: string;
  title: string;
  body: PortableTextBlock[];
  links: Sanity.Link[];
  _key: string;
}

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
}: Cta1Props) {
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
        <LinkButtons links={links || []} containerClassName="mt-10 links" direction="row" />
      </div>
    </SectionContainer>
  );
}
