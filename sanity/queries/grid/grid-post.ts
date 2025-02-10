import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const gridPostQuery = groq`
  _type == "grid-post" => {
    _type,
    _key,
    post->{
      title,
      slug,
      excerpt,
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
      categories[]->{
        _id,
        title,
      },
    },
  }
`;
