import { groq } from "next-sanity";

export const mediaQuery = groq`
  *[_type == "media"] | order(orderRank) {
    _id,
    _type,
    title,
    file {
      asset->
    },
    orderRank
  }
`;
