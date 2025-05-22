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
      }
    },
    links[] {
      ...,
      _type,
      _type == 'reference' => @->{_id, _type, title, slug},
      _type == 'pageLink' => {
        ...,
        "href": select(
          defined(page->slug.current) => "/" + page->slug.current,
          null
        ),
        "title": coalesce(title, page->title)
      },
    },
  },
`;
