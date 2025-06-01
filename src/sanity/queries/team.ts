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

export const TEAM_LIST_QUERY = groq`
  *[_type == "team"] | order(orderRank) {
    _id,
    title,
    slug,
    blocks[]{
      ${hero1Query}
      ${hero2Query}
      ${sectionHeaderQuery}
      ${splitRowQuery}
      ${gridRowQuery}
      ${carousel1Query}
      ${carousel2Query}
      ${timelineQuery}  
      ${cta1Query}
      ${logoCloud1Query}
      ${faqsQuery}
      ${formNewsletterQuery}
      ${featuredContentOffsetQuery}
      ${largeCalloutQuery}
      ${ctaTeamQuery}
    },
    image{
      asset->{
        _id,
        url,
        mimeType,
        metadata {
          lqip,
          dimensions {
            width,
            height
          }
        }
      },
      alt
    },
    role,
  }
`;

export const TEAM_SLUGS_QUERY = groq`
  *[_type == "team" && defined(slug.current)] | order(orderRank) {
    "slug": slug.current
    
  }
`;

export const TEAM_MEMBER_QUERY = groq`
  *[_type == "team" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    image{
      asset->{
        _id,
        url,
        mimeType,
        metadata {
          lqip,
          dimensions {
            width,
            height
          }
        }
      },
      alt
    },
    role,
    email,
    bio[]{
      ...,
      _type == "image" => {
        ...,
        asset->{
          _id,
          url,
          mimeType,
          metadata {
            lqip,
            dimensions {
              width,
              height
            }
          }
        }
      }
    },
    blocks,
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
