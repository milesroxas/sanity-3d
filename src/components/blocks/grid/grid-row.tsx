import SectionContainer, { ISectionPadding } from '@/components/ui/section-container';
import { cn } from '@/lib/utils';
import { stegaClean } from 'next-sanity';
// import only the components you need
import GridCard from './grid-card';
import GridPost from './grid-post';
import PricingCard from './pricing-card';

interface Grid1Props {
  padding?: ISectionPadding['padding'];
  direction?: ISectionPadding['direction'];
  colorVariant?:
    | 'primary'
    | 'secondary'
    | 'card'
    | 'accent'
    | 'destructive'
    | 'background'
    | 'transparent';
  gridColumns?: 'grid-cols-2' | 'grid-cols-3' | 'grid-cols-4';
  columns?: Sanity.Block[];
  _key?: string;
}

// map all components you need
const componentMap: { [key: string]: React.ComponentType<any> } = {
  'grid-card': GridCard,
  'pricing-card': PricingCard,
  'grid-post': GridPost,
};

export default function GridRow({
  padding,
  direction,
  colorVariant = 'background',
  gridColumns = 'grid-cols-3',
  columns,
  _key,
}: Grid1Props) {
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
      {columns && columns?.length > 0 && (
        <div className={cn(`grid grid-cols-1 gap-6`, `lg:${stegaClean(gridColumns)}`)}>
          {columns.map((block: Sanity.Block) => {
            const Component = componentMap[block._type];
            if (!Component) {
              // Fallback for unknown block types to debug
              return <div data-type={block._type} key={block._key} />;
            }
            return <Component {...block} color={color} key={block._key} />;
          })}
        </div>
      )}
    </SectionContainer>
  );
}
