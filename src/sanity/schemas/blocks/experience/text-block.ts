import { Text } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'text-block',
  title: 'Text Block',
  type: 'object',
  icon: Text,
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'block-content',
    }),
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({ content }) {
      const text = content?.[0]?.children?.[0]?.text || 'Text Block';
      return {
        title: text.length > 50 ? `${text.substring(0, 50)}...` : text,
      };
    },
  },
});
