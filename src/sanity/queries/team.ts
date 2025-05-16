import { groq } from 'next-sanity';

export const TEAM_LIST_QUERY = groq`
  *[_type == "team"] | order(orderRank) {
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
    name,
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
