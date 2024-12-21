import { groq } from "next-sanity";

export const pricingCardQuery = groq`
  _type == "pricing-card" => {
    _type,
    title,
    tagLine,
    price,
    list[],
    excerpt,
    link,
  },
`;
