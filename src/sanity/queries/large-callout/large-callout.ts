import { groq } from 'next-sanity';

export const largeCalloutQuery = groq`
  _type == "large-callout" => {
    _type,
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
`;
