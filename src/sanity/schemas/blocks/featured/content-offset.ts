import { Files } from 'lucide-react';
import { defineField, defineType } from 'sanity';
import link from '../shared/link';

export default defineType({
  name: 'featured-content-offset',
  title: 'Featured Content Offset',
  type: 'object',
  icon: Files,
  fields: [
    defineField({
      name: 'themeVariant',
      type: 'theme-variant',
      description: 'Select a theme variant',
    }),
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
      initialValue: 'both',
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'graphic',
      title: 'Graphic',
      type: 'image',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
        }),
      ],
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
      name: 'content',
      title: 'Content',
      type: 'block-content',
    }),
    defineField({
      name: 'links',
      type: link.name,
      validation: rule => rule.max(2),
    }),
    defineField({
      name: 'testimonials',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: 'Content Feature 1',
        subtitle: title || 'No Title',
      };
    },
  },
});
