import { Text } from 'lucide-react';
import { defineField, defineType } from 'sanity';
export default defineType({
  name: 'large-callout',
  title: 'Large Callout',
  type: 'object',
  icon: Text,
  fields: [
    defineField({
      name: 'body',
      type: 'block-content',
    }),
    defineField({
      name: 'textAlign',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
  ],
  preview: {
    select: {
      body: 'body',
    },
    prepare() {
      return {
        title: 'Large Callout',
      };
    },
  },
});
