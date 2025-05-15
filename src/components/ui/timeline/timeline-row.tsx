import SectionContainer, {
  ISectionContainerProps,
  ISectionPadding,
} from '@/components/ui/section-container';
import Timeline1, { Timeline1Props } from '@/components/ui/timeline/timeline-1';
import { stegaClean } from 'next-sanity';

export default function TimelineRow({
  padding,
  colorVariant,
  timelines,
}: Partial<{
  padding: ISectionPadding;
  colorVariant: ISectionContainerProps['color'];
  timelines: Timeline1Props[];
}>) {
  const color = stegaClean(colorVariant);

  return (
    <SectionContainer color={color} padding={padding}>
      {timelines && timelines?.length > 0 && (
        <div className="mx-auto max-w-[48rem]">
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
