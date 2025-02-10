import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const splitContentQuery = groq`
  _type == "split-content" => {
    _type,
    _key,
    sticky,
    padding,
    colorVariant,
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
    link,
  }
`;
