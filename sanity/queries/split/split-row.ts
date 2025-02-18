import { groq } from "next-sanity";
import { splitContentQuery } from "./split-content";
import { splitCardsListQuery } from "./split-cards-list";
import { splitImageQuery } from "./split-image";
import { splitInfoListQuery } from "./split-info-list";
import { splitVideoQuery } from "./split-video";
export const splitRowQuery = groq`
  _type == "split-row" => {
    _type,
    padding,
    colorVariant,
    noGap,
    splitColumns[]{
      ${splitContentQuery}
      ${splitCardsListQuery}
      ${splitImageQuery}
      ${splitInfoListQuery}
      ${splitVideoQuery}
    },
  },
`;
