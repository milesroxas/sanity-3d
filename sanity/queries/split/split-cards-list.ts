import { groq } from "next-sanity";

export const splitCardsListQuery = groq`
  _type == "split-cards-list" => {
    _type,
    list[]{
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
    },
  },
`;
