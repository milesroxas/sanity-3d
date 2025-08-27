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
      name: 'blocks',
      type: 'array',
      of: [{ type: 'text-block' }, { type: 'experience-carousel' }, { type: 'media' }],
    }),
    defineField({
      name: 'links',
      type: link.name,
      validation: (rule: any) => rule.max(2),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Expanded Body' };
    },
  },
});
