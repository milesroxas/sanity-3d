import { groq } from 'next-sanity';
import { carousel1Query } from './carousel/carousel-1';
import { carousel2Query } from './carousel/carousel-2';
import { cta1Query } from './cta/cta-1';
import { ctaTeamQuery } from './cta/cta-team';
import { faqsQuery } from './faqs';
import { featuredContentOffsetQuery } from './featured/content-offset';
import { formNewsletterQuery } from './forms/newsletter';
import { gridRowQuery } from './grid/grid-row';
import { hero1Query } from './hero/hero-1';
import { hero2Query } from './hero/hero-2';
import { largeCalloutQuery } from './large-callout/large-callout';
import { logoCloud1Query } from './logo-cloud/logo-cloud-1';
import { sectionHeaderQuery } from './section-header';
import { splitRowQuery } from './split/split-row';
import { timelineQuery } from './timeline';
export const PAGE_QUERY = groq`
  *[_type == "page" && slug.current == $slug][0]{
    blocks[]{
      ${hero1Query}
      ${hero2Query}
      ${sectionHeaderQuery}
      ${largeCalloutQuery}
      ${featuredContentOffsetQuery}
      ${splitRowQuery}
      ${gridRowQuery}
      ${carousel1Query}
      ${carousel2Query}
      ${timelineQuery}
      ${cta1Query}
      ${ctaTeamQuery}
      ${logoCloud1Query}
      ${faqsQuery}
      ${formNewsletterQuery}
    },
    meta_title,
    meta_description,
    noindex,
    ogImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
    }
  }
`;
