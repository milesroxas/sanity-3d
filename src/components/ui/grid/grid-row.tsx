import SectionContainer from '@/components/ui/section-container';
import { cn } from '@/lib/utils';
import { stegaClean } from 'next-sanity';
// import only the components you need
import GridCard from './grid-card';
import GridPost from './grid-post';
import PricingCard from './pricing-card';

interface Grid1Props {
  padding: {
    top: boolean;
    bottom: boolean;
  };
  colorVariant:
    | 'primary'
    | 'secondary'
    | 'card'
    | 'accent'
    | 'destructive'
    | 'background'
    | 'transparent';
  gridColumns: 'grid-cols-2' | 'grid-cols-3' | 'grid-cols-4';
  columns: Sanity.Block[];
}

// map all components you need
const componentMap: { [key: string]: React.ComponentType<any> } = {
  'grid-card': GridCard,
  'pricing-card': PricingCard,
  'grid-post': GridPost,
};

export default function GridRow({
  padding,
  colorVariant,
  gridColumns,
  columns,
}: Partial<Grid1Props>) {
  const color = stegaClean(colorVariant);

  return (
    <SectionContainer color={color} padding={padding}>
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
