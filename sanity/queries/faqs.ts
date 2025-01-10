import { groq } from "next-sanity";

export const faqsQuery = groq`
  _type == "faqs" => {
    _type,
    padding,
    colorVariant,
    faqs[]->{
      _id,
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
    },
  },
`;
