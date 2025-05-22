import { ListCollapse } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'faqs',
  type: 'object',
  icon: ListCollapse,
  fields: [
    defineField({
      name: 'padding',
      type: 'section-padding',
      title: 'Padding',
      description: 'Select a padding variant',
    }),
    defineField({
      name: 'direction',
      type: 'direction',
      title: 'Direction',
      description: 'Select a direction',
    }),
    defineField({
      name: 'colorVariant',
      type: 'color-variant',
      title: 'Color Variant',
      description: 'Select a background color variant',
    }),
    defineField({
      name: 'faqs',
      type: 'array',
      title: 'FAQs',
      of: [
        {
          name: 'faq',
          type: 'reference',
          to: [{ type: 'faq' }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'faqs.0.title',
    },
    prepare({ title }) {
      return {
        title: 'FAQs',
        subtitle: title || 'No Title',
      };
    },
  },
});
