import { groq } from 'next-sanity';

export const splitContentQuery = groq`
  _type == "split-content" => {
    _type,
    sticky,
    padding,
    themeVariant,
    tagLine,
    title,
    titleVariant,
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
      },
      _type == 'servicesLink' => {
        ...,
        services->{_id, _type, title, slug}
      },
    },
  },
`;
