import { ArrowDownNarrowWide } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'timeline-row',
  type: 'object',
  title: 'Timeline Row',
  description: 'Row of Timeline Sections',
  icon: ArrowDownNarrowWide,
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
      description: 'Select a background color variant',
    }),
    defineField({
      name: 'timelines',
      type: 'array',
      of: [{ type: 'timelines-1' }],
    }),
  ],
  preview: {
    select: {
      subtitle: 'timelines.0.title',
    },
    prepare({ subtitle }) {
      return {
        title: 'Timelines Row',
        subtitle,
      };
    },
  },
});
