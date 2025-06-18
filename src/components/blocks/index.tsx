import Carousel1 from '@/components/blocks/carousel/carousel-1';
import Carousel2 from '@/components/blocks/carousel/carousel-2';
import Cta1 from '@/components/blocks/cta/cta-1';
import FeaturedContentOffset from '@/components/blocks/featured/content-offset';
import GridRow from '@/components/blocks/grid/grid-row';
import Hero1 from '@/components/blocks/hero/hero-1';
import Hero2 from '@/components/blocks/hero/hero-2';
import LargeCallout from '@/components/blocks/large-callout/large-callout';
import LogoCloud1 from '@/components/blocks/logo-cloud/logo-cloud-1';
import SectionHeader from '@/components/blocks/section-header/section-header';
import SplitRow from '@/components/blocks/split/split-row';
import TimelineRow from '@/components/blocks/timeline/timeline-row';
import FAQs from '@/components/ui/faqs';
import FormNewsletter from '@/components/ui/forms/newsletter';
import CtaTeam from './cta/cta-team';
import ExpandedContent from './experience/content';

const componentMap: { [key: string]: React.ComponentType<any> } = {
  heroOne: Hero1,
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
  'section-content': ExpandedContent,
};

export default function Blocks({ blocks }: { blocks?: Sanity.Block[] }) {
  return (
    <>
      {blocks?.map((block: Sanity.Block, index: number) => {
        const Component = componentMap[block._type];

        const blockKey = block._key || `block-${block._type}-${index}`;

        if (!Component) {
          return <div data-type={block._type} key={blockKey} />;
        }

        return (
          <div
            key={blockKey}
            id={`block-${blockKey}`}
            className="block-wrapper"
            data-block-type={block._type}
          >
            <Component {...block} _key={blockKey} />
          </div>
        );
      })}
    </>
  );
}
