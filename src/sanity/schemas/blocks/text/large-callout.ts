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
