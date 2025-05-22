import Carousel1 from '@/components/blocks/carousel/carousel-1';
import Carousel2 from '@/components/blocks/carousel/carousel-2';
import Cta1 from '@/components/blocks/cta/cta-1';
import FeaturedContentOffset from '@/components/blocks/featured/content-offset';
import GridRow from '@/components/blocks/grid/grid-row';
import Hero1 from '@/components/blocks/hero/hero-1';
import Hero2 from '@/components/blocks/hero/hero-2';
import LargeCallout from '@/components/blocks/large-callout/large-callout';
import LogoCloud1 from '@/components/blocks/logo-cloud/logo-cloud-1';
import SplitRow from '@/components/blocks/split/split-row';
import TimelineRow from '@/components/blocks/timeline/timeline-row';
import FAQs from '@/components/ui/faqs';
import FormNewsletter from '@/components/ui/forms/newsletter';
import SectionHeader from '@/components/ui/section-header';
import CtaTeam from './cta/cta-team';

import { createBlurUp } from '@mux/blurup';

async function getVideoWithPlaceholder(playbackId: string) {
  try {
    const { blurDataURL, aspectRatio } = await createBlurUp(playbackId, {});
    return { blurDataURL, aspectRatio };
  } catch (error) {
    console.error('Error generating video placeholder:', error);
    return { blurDataURL: null, aspectRatio: 16 / 9 };
  }
}

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
          return <div data-type={block._type} key={block._key} />;
        }

        // Create a wrapper div with a data attribute to help with debugging
        return (
          <div
            key={block._key}
            id={`block-${block._key}`}
            className="block-wrapper"
            data-block-type={block._type}
          >
            <Component {...block} _key={block._key} />
          </div>
        );
      })}
    </>
  );
}
