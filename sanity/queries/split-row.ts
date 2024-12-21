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
      body,
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
