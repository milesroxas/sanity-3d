import { groq } from "next-sanity";

export const splitRowQuery = groq`
  _type == "split-row" => {
    _type,
    padding,
    colorVariant,
    splitColumns[]{
      position,
      tagLine,
      title,
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
      link,
    },
  },
`;
