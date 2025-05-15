import { LayoutGrid } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'featured-row',
  title: 'Featured Row',
  type: 'object',
  icon: LayoutGrid,
  fields: [
    defineField({
      name: 'padding',
      type: 'section-padding',
    }),
    defineField({
      name: 'colorVariant',
      type: 'color-variant',
      title: 'Color Variant',
      description: 'Select a background color variant',
    }),
    defineField({
      name: 'gridColumns',
      type: 'string',
      title: 'Grid Columns',
      initialValue: 'grid-cols-3',
    }),
    // add only the blocks you need
    defineField({
      name: 'columns',
      type: 'array',
      of: [{ type: 'grid-card' }, { type: 'grid-post' }, { type: 'pricing-card' }],
    }),
  ],
  preview: {
    select: {
      title: 'columns.0.title',
    },
    prepare({ title }) {
      return {
        title: 'Grid Row',
        subtitle: title,
      };
    },
  },
});
