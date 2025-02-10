import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const timelineQuery = groq`
  _type == "timeline-row" => {
    _type,
    _key,
    padding,
    colorVariant,
    timelines[]{
      title,
      tagLine,
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
