'use client';

import PortableTextRenderer from '@/components/portable-text-renderer';
import { Button } from '@/components/ui/button';
import { ISectionContainerProps, ISectionPadding } from '@/components/ui/section-container';
import TagLine from '@/components/ui/tag-line';
import { cn } from '@/lib/utils';
import { PortableTextBlock, stegaClean } from 'next-sanity';
import Link from 'next/link';
import { createElement } from 'react';

export interface SplitContentProps {
  sticky: boolean;
  color: ISectionContainerProps['color'];
  colorVariant: ISectionContainerProps['color'];
  styleVariant: ISectionContainerProps['style'];
  themeVariant: ISectionContainerProps['theme'];
  padding: ISectionPadding;
  noGap: boolean;
  tagLine: string;
  title: string;
  body: PortableTextBlock[];
  link: {
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
  };
}

export default function SplitContent({
  sticky,
  padding,
  noGap,
  tagLine,
  title,
  body,
  link,
  styleVariant,
  themeVariant,
  color,
}: Partial<SplitContentProps>) {
  const style = stegaClean(styleVariant);
  const theme = stegaClean(themeVariant);
  const isOffset = style === 'offset';
  const isDark = theme === 'dark';
  const bgColor = stegaClean(color) || 'background';

  // Helper function to get padding classes based on size
  const getPaddingClasses = (size: ISectionPadding['padding']) => {
    switch (size) {
      case 'none':
        return { top: '', bottom: '' };
      case 'small':
        return { top: 'pt-8 xl:pt-16', bottom: 'pb-8 xl:pb-16' };
      case 'medium':
        return { top: 'pt-16 xl:pt-24', bottom: 'pb-16 xl:pb-24' };
      case 'large':
        return { top: 'pt-24 xl:pt-32', bottom: 'pb-24 xl:pb-32' };
      case 'xlarge':
        return { top: 'pt-32 xl:pt-48', bottom: 'pb-32 xl:pb-48' };
      default:
        return { top: '', bottom: '' };
    }
  };

  // Apply padding based on direction if padding is provided
  const paddingClasses = padding ? getPaddingClasses(padding.padding) : { top: '', bottom: '' };

  const paddingTopClass =
    padding && (padding.direction === 'top' || padding.direction === 'both')
      ? paddingClasses.top
      : '';

  const paddingBottomClass =
    padding && (padding.direction === 'bottom' || padding.direction === 'both')
      ? paddingClasses.bottom
      : '';

  return (
    <div
      className={cn(
        !sticky ? 'flex flex-col items-center justify-center' : 'flex flex-col items-center',
        paddingTopClass,
        paddingBottomClass,
        'w-full'
      )}
    >
      <div
        className={cn(
          'flex flex-col items-start will-change-transform',
          sticky ? 'lg:sticky lg:top-56' : undefined,
          noGap ? 'px-10' : undefined,
          isOffset ? 'lg:max-w-[500px] lg:rounded-md lg:p-16' : 'lg:max-w-[550px]',
          isOffset ? `lg:bg-${bgColor}/10 lg:shadow-lg lg:backdrop-blur-sm` : undefined,
          isOffset && isDark ? 'lg:bg-black/70' : undefined
        )}
      >
        {tagLine && (
          <TagLine title={tagLine} element="h2" className={isDark ? 'text-primary' : undefined} />
        )}
        {title &&
          createElement(
            tagLine ? 'h3' : 'h2',
            {
              className: cn('my-4 font-semibold leading-[1.2] text-4xl'),
            },
            title
          )}
        {body && <PortableTextRenderer value={body} />}
        {Array.isArray(link) && link.length > 0 && (
          <div className="flex flex-col">
            {link.map((l, idx) => {
              if (!l) return null;
              if ((l as any)._type === 'reference' && (l as any).slug) {
                const ref = l as { _id?: string; title?: string; slug?: { current: string } };
                return (
                  <Button
                    key={ref._id || ref.title || idx}
                    className="mt-2"
                    variant="default"
                    size="lg"
                    asChild
                  >
                    <Link href={`/${ref.slug?.current || ''}`}>{ref.title}</Link>
                  </Button>
                );
              }
              return (
                <Button
                  key={l.title || idx}
                  className="mt-2"
                  variant={stegaClean((l as any)?.buttonVariant)}
                  size="lg"
                  asChild
                >
                  <Link
                    href={(l as any).href || '#'}
                    target={(l as any).target ? '_blank' : undefined}
                  >
                    {l.title}
                  </Link>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
