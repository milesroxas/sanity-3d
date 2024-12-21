import { groq } from "next-sanity";

export const cta1Query = groq`
  _type == "cta-1" => {
    _type,
    padding,
    colorVariant,
    sectionWidth,
    stackAlign,
    tagLine,
    title,
    body,
    links,
  },
`;
