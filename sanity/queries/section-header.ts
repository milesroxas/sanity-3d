import { groq } from "next-sanity";

export const sectionHeaderQuery = groq`
  _type == "section-header" => {
    _type,
    padding,
    colorVariant,
    sectionWidth,
    stackAlign,
    tagLine,
    title,
    description,
    link,
  },
`;
