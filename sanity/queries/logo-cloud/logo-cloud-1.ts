import { groq } from "next-sanity";

export const logoCloud1Query = groq`
  _type == "logo-cloud-1" => {
    _type,
    padding,
    colorVariant,
    title,
    images[]{
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
      alt
    },
  },
`;
