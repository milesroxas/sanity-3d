import Carousel1 from '@/components/ui/carousel/carousel-1';
import Carousel2 from '@/components/ui/carousel/carousel-2';
import Cta1 from '@/components/ui/cta/cta-1';
import FAQs from '@/components/ui/faqs';
import FeaturedContentOffset from '@/components/ui/featured/content-offset';
import FormNewsletter from '@/components/ui/forms/newsletter';
import GridRow from '@/components/ui/grid/grid-row';
import Hero1 from '@/components/ui/hero/hero-1';
import Hero2 from '@/components/ui/hero/hero-2';
import LargeCallout from '@/components/ui/large-callout/large-callout';
import LogoCloud1 from '@/components/ui/logo-cloud/logo-cloud-1';
import SectionHeader from '@/components/ui/section-header';
import SplitRow from '@/components/ui/split/split-row';
import TimelineRow from '@/components/ui/timeline/timeline-row';
import CtaTeam from './ui/cta/cta-team';

const componentMap: { [key: string]: React.ComponentType<any> } = {
  'hero-1': Hero1,
  'hero-2': Hero2,
  'section-header': SectionHeader,
  'split-row': SplitRow,
  'grid-row': GridRow,
  'carousel-1': Carousel1,
  'carousel-2': Carousel2,
  'timeline-row': TimelineRow,
  'cta-1': Cta1,
  'cta-team': CtaTeam,
  'logo-cloud-1': LogoCloud1,
  faqs: FAQs,
  'form-newsletter': FormNewsletter,
  'large-callout': LargeCallout,
  'featured-content-offset': FeaturedContentOffset,
};

export default function Blocks({ blocks }: { blocks?: Sanity.Block[] }) {
  return (
    <>
      {blocks?.map((block: Sanity.Block) => {
        const Component = componentMap[block._type];
        if (!Component) {
          // Fallback for unknown block types to debug
          console.log('Unknown block type:', block._type);
          return <div data-type={block._type} key={block._key} />;
        }
        return <Component {...block} key={block._key} />;
      })}
    </>
  );
}
