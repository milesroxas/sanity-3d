import { groq } from 'next-sanity';

export const NAV_QUERY = groq`
  *[_type == "nav"][0] {
    _id,
    _type,
    logo {
      asset->,
      alt
    },
    companyLinks[] {
      _type,
      title,
      "slug": page->slug,
      page-> {
        "slug": slug.current
      }
    },
    services[] {
      _type,
      title,
      "slug": services->slug,
      services-> {
        "slug": slug.current
      }
    },
    legal[] {
      _type,
      title,
      "slug": page->slug,
      page-> {
        "slug": slug.current
      }
    }
  }
`;
