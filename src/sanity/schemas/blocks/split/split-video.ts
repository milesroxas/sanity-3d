import { Video } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'split-video',
  type: 'object',
  icon: Video,
  description: 'Column with full video.',
  fields: [
    defineField({
      title: 'Video file',
      name: 'video',
      type: 'mux.video',
    }),
    defineField({
      name: 'videoOptions',
      title: 'Video Options',
      type: 'object',
      fields: [
        defineField({
          name: 'hideControls',
          title: 'Hide Controls',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'sizeVariant',
          title: 'Size Variant',
          type: 'string',
          description: 'Choose how the video should size within its container',
          options: {
            list: [
              { title: 'Default', value: 'default' },
              { title: '818 x 1021 (cover)', value: '818x1021' },
            ],
            layout: 'radio',
          },
          initialValue: 'default',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'video.title',
    },
    prepare({ title }) {
      return {
        title: title || 'No Title',
      };
    },
  },
});
