import { UsersRound } from 'lucide-react';
import { defineField, defineType } from 'sanity';
import link from '../shared/link';

export default defineType({
  name: 'cta-team',
  title: 'CTA Team',
  type: 'object',
  icon: UsersRound,
  fields: [
    defineField({
      name: 'padding',
      type: 'section-padding',
      initialValue: 'small',
    }),
    defineField({
      name: 'direction',
      type: 'direction',
      initialValue: 'both',
    }),
    defineField({
      name: 'colorVariant',
      type: 'color-variant',
      title: 'Color Variant',
      description: 'Select a background color variant',
    }),
    defineField({
      name: 'tagLine',
      type: 'string',
    }),
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'body',
      type: 'block-content',
    }),
    defineField({
      name: 'links',
      type: link.name,
      validation: rule => rule.max(2),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: 'CTA Team',
        subtitle: title,
      };
    },
  },
});
