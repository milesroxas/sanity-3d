import Timeline1, { Timeline1Props } from '@/components/blocks/timeline/timeline-1';
import SectionContainer, {
  ISectionContainerProps,
  ISectionPadding,
} from '@/components/ui/section-container';
import { stegaClean } from 'next-sanity';

export default function TimelineRow({
  padding,
  direction,
  colorVariant,
  timelines,
}: Partial<{
  padding: ISectionPadding['padding'];
  direction: ISectionPadding['direction'];
  colorVariant: ISectionContainerProps['color'];
  timelines: Timeline1Props[];
}>) {
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
    <SectionContainer color="transparent" padding={sectionPadding} noContainer>
      {timelines && timelines?.length > 0 && (
        <div className="w-full max-w-3xl px-6 lg:px-0">
          {timelines?.map((timeline, index) => (
            <Timeline1
              key={index}
              color={color}
              tagLine={timeline.tagLine}
              title={timeline.title}
              body={timeline.body}
            />
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
