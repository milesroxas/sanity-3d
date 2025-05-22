import { Images } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'logo-cloud-1',
  type: 'object',
  icon: Images,
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
      initialValue: 'both',
    }),
    defineField({
      name: 'colorVariant',
      type: 'color-variant',
      title: 'Color Variant',
      description: 'Select a background color variant',
    }),
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'images',
      type: 'array',
      of: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: 'Logo Cloud',
        subtitle: title || 'No Title',
      };
    },
  },
});
