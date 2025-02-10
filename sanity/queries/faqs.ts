import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const faqsQuery = groq`
  _type == "faqs" => {
    _type,
    _key,
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
  }
`;
