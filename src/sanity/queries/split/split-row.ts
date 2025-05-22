import { groq } from 'next-sanity';
import { splitCardsListQuery } from './split-cards-list';
import { splitContentQuery } from './split-content';
import { splitImageQuery } from './split-image';
import { splitInfoListQuery } from './split-info-list';
import { splitVideoQuery } from './split-video';
export const splitRowQuery = groq`
  _type == "split-row" => {
    _type,
    padding,
    direction,
    colorVariant,
    styleVariant,
    themeVariant,
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
