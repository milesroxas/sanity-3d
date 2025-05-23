import SectionContainer, {
  ISectionContainerProps,
  ISectionPadding,
} from '@/components/ui/section-container';
import { cn } from '@/lib/utils';
import { stegaClean } from 'next-sanity';

export default function SectionHeader({
  padding,
  direction,
  colorVariant,
  sectionWidth = 'default',
  stackAlign = 'left',
  tagLine,
  title,
  description,
}: Partial<{
  padding: ISectionPadding['padding'];
  direction: ISectionPadding['direction'];
  colorVariant: ISectionContainerProps['color'];
  stackAlign: 'left' | 'center';
  sectionWidth: 'default' | 'narrow';
  tagLine: string;
  title: string;
  description: string;
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
          isNarrow ? 'max-w-[38rem]' : undefined
        )}
      >
        <div className={cn(color === 'primary' ? 'text-background' : undefined)}>
          {tagLine && (
            <h1 className="mb-4 leading-[0]">
              <span className="text-base font-light uppercase text-secondary-foreground">
                {tagLine}
              </span>
            </h1>
          )}
          {title && (
            <h2
              className={cn(
                'mb-4 text-3xl text-card-foreground md:text-4xl',
                !description && 'mb-0'
              )}
            >
              {title}
            </h2>
          )}
        </div>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
    </SectionContainer>
  );
}
