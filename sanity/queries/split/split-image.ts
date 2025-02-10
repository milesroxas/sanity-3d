import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const splitImageQuery = groq`
  _type == "split-image" => {
    _type,
    _key,
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
  }
`;
