import { WalletCards } from 'lucide-react';
import { defineField, defineType } from 'sanity';
import link from '../shared/link';

export default defineType({
  name: 'pricing-card',
  type: 'object',
  icon: WalletCards,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'tagLine',
      type: 'string',
    }),
    defineField({
      name: 'price',
      type: 'object',
      fields: [
        defineField({
          name: 'value',
          type: 'number',
        }),
        defineField({
          name: 'period',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'list',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
    }),
    defineField({
      name: 'link',
      type: link.name,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price.value',
      period: 'price.period',
    },
    prepare({ title, price, period }) {
      return {
        title: 'Pricing Card',
        subtitle: `${title}: ${price}${period}`,
      };
    },
  },
});
