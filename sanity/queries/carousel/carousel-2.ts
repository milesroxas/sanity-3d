import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const carousel2Query = groq`
  _type == "carousel-2" => {
    _type,
    _key,
    padding,
    colorVariant,
    testimonial[]->{
      _id,
      name,
      title,
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
      body[]{
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
      rating,
    },
  }
`;
