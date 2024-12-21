import { groq } from "next-sanity";

export const gridPostQuery = groq`
  _type == "grid-post" => {
    _type,
    ...post->{
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
        title,
      },
    },
  },
`;
