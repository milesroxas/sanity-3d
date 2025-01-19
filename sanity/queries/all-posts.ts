import { groq } from "next-sanity";

export const allPostsQuery = groq`
  _type == "all-posts" => {
    _type,
    padding,
    colorVariant,
  },
`;
