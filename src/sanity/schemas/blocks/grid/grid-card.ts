import { LayoutGrid } from 'lucide-react';
import { defineField, defineType } from 'sanity';
import link from '../shared/link';

export default defineType({
  name: 'grid-card',
  type: 'object',
  icon: LayoutGrid,
  fields: [
    defineField({
      name: 'style',
      title: 'Card Style',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Minimal', value: 'minimal' },
          { title: 'Accent', value: 'accent' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
    }),
    defineField({
      name: 'image',
      type: 'image',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'link',
      type: link.name,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      style: 'style',
    },
    prepare({ title, media, style }) {
      return {
        title: `Grid Card${style !== 'default' ? ` — ${style}` : ''}`,
        subtitle: title || 'No title',
        media,
      };
    },
  },
});
