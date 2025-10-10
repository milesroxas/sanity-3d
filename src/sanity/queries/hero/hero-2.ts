import { groq } from 'next-sanity';

export const hero2Query = groq`
  _type == "hero-2" => {
    _type,
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
      },
      _type == "muxVideo" => {
        ...,
        video {
          asset-> {
            _id,
            playbackId,
            assetId,
            filename,
            status
          }
        }
      }
    },
    links[] {
      ...,
      _type == 'pageLink' => {
        ...,
        page->{_id, _type, title, slug}
      },
      _type == 'customLink' => {
        ...
      }
    },
  },
`;
