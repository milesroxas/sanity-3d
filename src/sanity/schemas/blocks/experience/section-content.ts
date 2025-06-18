import { LayoutTemplate } from 'lucide-react';
import { defineField, defineType } from 'sanity';
import link from '../shared/link';
export default defineType({
  name: 'section-content',
  title: 'Section Content',
  type: 'object',
  icon: LayoutTemplate,
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      title: 'Section Heading',
    }),
    defineField({
      name: 'sectionBody',
      title: 'Section Body',
      type: 'block-content',
    }),
    defineField({
      name: 'expandedBody',
      title: 'Expanded Body',
      type: 'block-content',
    }),
    defineField({
      name: 'links',
      type: link.name,
      validation: (rule: any) => rule.max(2),
    }),
  ],
});
