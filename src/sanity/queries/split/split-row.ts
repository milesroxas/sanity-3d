import { groq } from 'next-sanity';
import { splitContentQuery } from './split-content';
import { splitImageQuery } from './split-image';
import { splitVideoQuery } from './split-video';
export const splitRowQuery = groq`
  _type == "split-row" => {
    _key,
    _type,
    padding,
    direction,
    colorVariant,
    styleVariant,
    themeVariant,
    noGap,
    splitColumns[]{
      ${splitContentQuery}
      ${splitImageQuery}
      ${splitVideoQuery}
    },
  },
`;
