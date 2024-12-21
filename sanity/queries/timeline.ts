import { groq } from "next-sanity";

export const timelineQuery = groq`
  _type == "timeline-row" => {
    _type,
    padding,
    colorVariant,
    timelines[]{
      title,
      tagLine,
      body,
    },
  },
`;
