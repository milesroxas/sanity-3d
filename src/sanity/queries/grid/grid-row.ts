import { gridCardQuery } from '@/sanity/queries/grid/grid-card';
import { gridPostQuery } from '@/sanity/queries/grid/grid-post';
import { pricingCardQuery } from '@/sanity/queries/grid/pricing-card';
import { groq } from 'next-sanity';

export const gridRowQuery = groq`
  _type == "grid-row" => {
    _key,
    _type,
    padding,
    direction,
    colorVariant,
    gridColumns,
    columns[]{
      ${gridCardQuery}
      ${pricingCardQuery}
      ${gridPostQuery}
    },
  },
`;
