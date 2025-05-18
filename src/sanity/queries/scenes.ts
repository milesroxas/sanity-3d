import { groq } from 'next-sanity';

export const SCENES_QUERY = groq`*[_type == "scenes" && defined(slug.current)] {
  _id,
  _type,
  title,
  slug,
  links[] {
      ...,
      _type,
      _type == 'reference' => @->{_id, _type, title, slug},
    },
  mainSceneMarkerPosition {
    x,
    y,
    z
  }
}`;

export const SCENES_SLUGS_QUERY = groq`*[_type == "scenes" && defined(slug.current)]{
  "slug": slug.current
}`;
