import { groq } from "next-sanity";

export const gridTeamQuery = groq`
  _type == "grid-team" => {
    _type,
    ...member->{
      title,
      slug,
      role,
      bio,
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
    },
  },
`;
