import { groq } from 'next-sanity';

export const hero1Query = groq`
  _type == "heroOne" => {
    _key,
    _type,
    tagLine,
    title,
    body[]{
      ...,
      markDefs[]{
        ...,
        _type == "link" => {
          "href": @.href
        }
      }
    },
    mediaType,
    image{
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
    video{
      asset->{
        _id,
        playbackId,
        status
      }
    },
    videoOptions{
      hideControls
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
