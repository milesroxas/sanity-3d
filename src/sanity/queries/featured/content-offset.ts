import { groq } from 'next-sanity';

export const featuredContentOffsetQuery = groq`
  _type == "featured-content-offset" => {
    _type,
    _key,
    tagLine,
    title,
    padding,
    direction,
    content[]{
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
    image {
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
    },
    graphic {
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
    },
    links[] {
      ...,
      _type,
      _type == 'reference' => @->{_id, _type, title, slug},
      _type == 'customLink' => {
        ...,
        buttonVariant
      }
    },
    testimonials[] {
      ...,
      _type,
      _type == 'reference' => @->{_id, _type, name, quote, title, image{
        asset->{
          _id,
          url
        }
      }},
    },
    themeVariant
  },
`;
