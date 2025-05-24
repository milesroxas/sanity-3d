import { LayoutTemplate } from 'lucide-react';
import { defineField, defineType } from 'sanity';
import link from '../shared/link';

export default defineType({
  name: 'hero-2',
  title: 'Hero 2',
  type: 'object',
  icon: LayoutTemplate,
  fields: [
    defineField({
      name: 'padding',
      type: 'section-padding',
      title: 'Padding',
      description: 'Select a padding variant',
      initialValue: 'small',
    }),
    defineField({
      name: 'direction',
      type: 'direction',
      title: 'Direction',
      description: 'Select a direction',
      initialValue: 'none',
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
      validation: (rule: any) => rule.max(2),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: 'Hero 2',
        subtitle: title,
      };
    },
  },
});
