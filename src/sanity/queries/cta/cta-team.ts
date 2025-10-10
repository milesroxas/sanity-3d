import { groq } from 'next-sanity';

export const ctaTeamQuery = groq`
  _type == "cta-team" => {
    _type,
    padding,
    direction,
    colorVariant,
    sectionWidth,
    stackAlign,
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
      },
      _type == 'servicesLink' => {
        ...,
        services->{_id, _type, title, slug}
      },
    },
  },
`;
