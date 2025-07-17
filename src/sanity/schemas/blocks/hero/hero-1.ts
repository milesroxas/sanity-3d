import { LayoutTemplate } from 'lucide-react';
import { defineField, defineType } from 'sanity';
import link from '../shared/link';

export default defineType({
  name: 'heroOne',
  title: 'Hero 1',
  type: 'object',
  icon: LayoutTemplate,
  fields: [
    defineField({
      name: 'tagLine',
      title: 'Tag Line',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    }),
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
      },
      initialValue: 'image',
    }),
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
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'mux.video',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
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
      hidden: ({ parent }) => parent?.mediaType !== 'video',
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
      media: 'image',
    },
    prepare({ title, media }) {
      return {
        title: 'Hero 1',
        subtitle: title,
        media,
      };
    },
  },
});
