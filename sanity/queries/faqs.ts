import { groq } from "next-sanity";

export const faqsQuery = groq`
  _type == "faqs" => {
    _type,
    padding,
    colorVariant,
    faqs[]->{
      _id,
      title,
      body,
    },
  },
`;
