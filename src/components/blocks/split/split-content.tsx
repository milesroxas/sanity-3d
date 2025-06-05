'use client';

import PortableTextRenderer from '@/components/portable-text-renderer';
import { LinkButtons } from '@/components/shared/link-button';
import { ISectionContainerProps, ISectionPadding } from '@/components/ui/section-container';
import TagLine from '@/components/ui/tag-line';
import { cn } from '@/lib/utils';
import { PortableTextBlock, stegaClean } from 'next-sanity';
import { createElement } from 'react';

export interface SplitContentProps {
  sticky: boolean;
  color: ISectionContainerProps['color'];
  styleVariant: ISectionContainerProps['style'];
  themeVariant: ISectionContainerProps['theme'];
  padding: ISectionPadding;
  noGap: boolean;
  tagLine: string;
  title: string;
  body: PortableTextBlock[];
  links: Sanity.Link[];
}

export default function SplitContent({
  sticky,
  padding,
  noGap,
  tagLine,
  title,
  body,
  links,
  styleVariant,
  themeVariant,
  color,
}: Partial<SplitContentProps>) {
  const style = stegaClean(styleVariant);
  const theme = stegaClean(themeVariant);
  const isOffset = style === 'offset';
  const isDark = theme === 'dark';

  return (
    <div className={cn('w-full', isOffset && 'lg:w-full')}>
      <div
        className={cn(
          'flex flex-col items-start',
          !isOffset && 'lg:max-w-[550px]',
          !isOffset && sticky ? 'lg:sticky lg:top-56' : undefined
        )}
      >
        {tagLine && (
          <TagLine title={tagLine} element="h2" className={isDark ? 'text-primary' : undefined} />
        )}
        {title &&
          createElement(
            tagLine ? 'h3' : 'h2',
            {
              className: cn('my-4 font-bold leading-[1.2] text-4xl text-card-foreground'),
            },
            title
          )}

        {body && (
          <div
            className={cn(
              'prose prose-lg prose-p:my-4 prose-p:leading-relaxed prose-p:text-muted-foreground',
              links && 'mb-12'
            )}
          >
            <PortableTextRenderer value={body} />
          </div>
        )}

        {links && (
          <div className="flex w-full max-w-md gap-3">
            {links.slice(0, 2).map((link, index) => (
              <LinkButtons
                key={index}
                links={[link]}
                size="sm"
                direction="column"
                variant={index === 0 ? 'default' : 'ghost'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
