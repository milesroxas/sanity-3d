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
