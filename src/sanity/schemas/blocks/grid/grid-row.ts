import { LayoutGrid } from 'lucide-react';
import { defineField, defineType } from 'sanity';
import { COLS_VARIANTS } from '../shared/layout-variants';

export default defineType({
  name: 'grid-row',
  title: 'Grid Row',
  type: 'object',
  icon: LayoutGrid,
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
      name: 'gridColumns',
      type: 'string',
      title: 'Grid Columns',
      options: {
        list: COLS_VARIANTS.map(({ title, value }) => ({ title, value })),
        layout: 'radio',
      },
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
