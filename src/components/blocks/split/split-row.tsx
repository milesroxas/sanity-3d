'use client';

import SectionContainer, {
  ISectionContainerProps,
  ISectionPadding,
} from '@/components/ui/section-container';
import { cn } from '@/lib/utils';
import { stegaClean } from 'next-sanity';
import SplitCardsList from './split-cards-list';
import SplitContent from './split-content';
import SplitImage from './split-image';
import SplitInfoList from './split-info-list';
import SplitVideo from './split-video';

const componentMap = {
  'split-content': SplitContent,
  'split-cards-list': SplitCardsList,
  'split-image': SplitImage,
  'split-info-list': SplitInfoList,
  'split-video': SplitVideo,
} as const;

export default function SplitRow({
  padding,
  direction,
  colorVariant,
  themeVariant,
  styleVariant,
  noGap,
  splitColumns,
}: Partial<{
  padding: ISectionPadding['padding'];
  direction: ISectionPadding['direction'];
  colorVariant: ISectionContainerProps['color'];
  themeVariant: ISectionContainerProps['theme'];
  styleVariant: ISectionContainerProps['style'];
  noGap: boolean;
  splitColumns: Array<{
    _type: 'split-content' | 'split-cards-list' | 'split-image' | 'split-info-list' | 'split-video';
    _key: string;
  }>;
}>) {
  const color = stegaClean(colorVariant);
  const theme = stegaClean(themeVariant);
  const style = stegaClean(styleVariant);

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

  return (
    <>
      <SectionContainer
        color={color}
        padding={sectionPadding}
        theme={theme}
        style={style}
        noGap={noGap}
        className={'transition-colors duration-700'}
      >
        <div
          className={cn('grid grid-cols-1 lg:grid-cols-2', noGap ? 'gap-0' : 'gap-10 md:gap-20')}
        >
          {splitColumns.map((block, index) => {
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
      </SectionContainer>
    </>
  );
}
