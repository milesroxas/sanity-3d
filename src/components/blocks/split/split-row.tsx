'use client';

import SectionContainer, {
  ISectionContainerProps,
  ISectionPadding,
} from '@/components/ui/section-container';
import { cn } from '@/lib/utils';
import { stegaClean } from 'next-sanity';
import SplitContent from './split-content';
import SplitImage from './split-image';
import SplitVideo from './split-video';

const componentMap = {
  'split-content': SplitContent,
  'split-image': SplitImage,
  'split-video': SplitVideo,
} as const;

// Helper to generate background color classes with opacity
const getBgColorClass = (color: string | undefined, isDark: boolean, isOffset: boolean) => {
  if (!isOffset) return '';

  if (isDark) return 'lg:bg-black/70 lg:backdrop-blur-sm';

  if (!color || color === 'transparent') return '';

  switch (color) {
    case 'primary':
      return 'lg:bg-primary/10 lg:backdrop-blur-sm';
    case 'secondary':
      return 'lg:bg-secondary/10 lg:backdrop-blur-sm';
    case 'card':
      return 'lg:bg-card/10 lg:backdrop-blur-sm';
    case 'accent':
      return 'lg:bg-accent/10 lg:backdrop-blur-sm';
    case 'destructive':
      return 'lg:bg-destructive/10 lg:backdrop-blur-sm';
    case 'background':
    default:
      return 'lg:bg-background/50 lg:backdrop-blur-sm';
  }
};

export default function SplitRow({
  padding,
  direction,
  colorVariant,
  themeVariant,
  styleVariant,
  noGap,
  splitColumns,
  _key,
}: Partial<{
  padding: ISectionPadding['padding'];
  direction: ISectionPadding['direction'];
  colorVariant: ISectionContainerProps['color'];
  themeVariant: ISectionContainerProps['theme'];
  styleVariant: ISectionContainerProps['style'];
  noGap: boolean;
  splitColumns: Array<{
    _type: 'split-content' | 'split-image' | 'split-video';
    _key: string;
  }>;
  _key?: string;
}>) {
  const color = stegaClean(colorVariant);
  const theme = stegaClean(themeVariant);
  const style = stegaClean(styleVariant);
  const isOffset = style === 'offset';
  const isDark = theme === 'dark';

  // Combine padding and direction into ISectionPadding object
  const sectionPadding: ISectionPadding | undefined =
    padding && direction
      ? {
          padding: stegaClean(padding),
          direction: stegaClean(direction),
        }
      : undefined;

  if (!splitColumns || splitColumns.length === 0) {
    return null;
  }

  // Find content and media blocks
  const contentBlock = splitColumns.find(block => block._type === 'split-content');
  const mediaBlock = splitColumns.find(
    block => block._type === 'split-image' || block._type === 'split-video'
  );

  return (
    <div>
      <SectionContainer
        color={color}
        padding={sectionPadding}
        theme={theme}
        style={style}
        noGap={noGap}
        className={'transition-colors duration-700'}
      >
        {/* Standard layout for mobile (all cases) and desktop (when not offset) */}
        <div
          className={cn(
            isOffset ? 'lg:hidden' : '',
            'grid grid-cols-1 lg:grid-cols-2',
            noGap ? 'gap-0' : 'gap-10 md:gap-20'
          )}
        >
          {splitColumns.map(block => {
            const Component = componentMap[block._type as keyof typeof componentMap];
            if (!Component) {
              return <div data-type={block._type} key={block._key} />;
            }

            return (
              <Component
                {...block}
                color={color}
                styleVariant={style}
                themeVariant={theme}
                key={block._key}
              />
            );
          })}
        </div>

        {/* Offset layout for desktop only - using absolute positioning for reliable overlap */}
        {isOffset && contentBlock && mediaBlock && (
          <div className="relative hidden h-[40rem] lg:block">
            {/* First render the media (image/video) */}
            {mediaBlock && (
              <div
                key={mediaBlock._key}
                className={cn(
                  'absolute top-0 z-10 h-full',
                  // Position based on original order
                  splitColumns.indexOf(mediaBlock) === 0 ? 'left-0' : 'right-0',
                  'w-[60%]'
                )}
              >
                {(() => {
                  const Component = componentMap[mediaBlock._type as keyof typeof componentMap];
                  return Component ? (
                    <Component
                      {...mediaBlock}
                      color={color}
                      styleVariant={style}
                      themeVariant={theme}
                    />
                  ) : null;
                })()}
              </div>
            )}

            {/* Then render the content (always on top) */}
            {contentBlock && (
              <div
                key={contentBlock._key}
                className={cn(
                  'absolute top-0 z-20 h-full',
                  // Position based on original order
                  splitColumns.indexOf(contentBlock) === 0 ? 'left-0' : 'right-0',
                  'flex w-[60%] items-center'
                )}
              >
                <div
                  className={cn(
                    'max-w-[500px] rounded-md p-8 shadow-lg',
                    // Apply background color with helper function
                    getBgColorClass(color, isDark, isOffset)
                  )}
                >
                  {(() => {
                    const Component = componentMap[contentBlock._type as keyof typeof componentMap];
                    return Component ? (
                      <Component
                        {...contentBlock}
                        color={color}
                        styleVariant={style}
                        themeVariant={theme}
                      />
                    ) : null;
                  })()}
                </div>
              </div>
            )}
          </div>
        )}
      </SectionContainer>
    </div>
  );
}
