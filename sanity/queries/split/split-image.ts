import { groq } from "next-sanity";

export const splitImageQuery = groq`
  _type == "split-image" => {
    _type,
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
  },
`;
