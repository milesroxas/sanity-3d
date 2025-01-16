import { groq } from "next-sanity";

export const settingsQuery = groq`
  *[_type == "settings"][0] {
    _type,
    logo {
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
    largeLogo {
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
    }
  }
`;
