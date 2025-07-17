import { Text } from 'lucide-react';
import { defineField, defineType } from 'sanity';
import link from '../shared/link';
export default defineType({
  name: 'expanded-body',
  title: 'Expanded Body',
  type: 'object',
  icon: Text,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Expanded Body',
      type: 'block-content',
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
    },
    prepare({ title }) {
      return { title: title || 'Expanded Body' };
    },
  },
});
