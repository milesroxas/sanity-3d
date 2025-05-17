import { Menu } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'nav',
  title: 'Nav',
  type: 'document',
  icon: Menu,
  groups: [
    { name: 'company', title: 'Company' },
    { name: 'services', title: 'Services' },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Displayed in the header.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Description of the image for accessibility.',
        }),
      ],
    }),
    defineField({
      name: 'companyLinks',
      title: 'Company Links',
      type: 'link',
      group: 'company',
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'link',
      group: 'services',
    }),
    defineField({
      name: 'legal',
      title: 'Legal',
      type: 'link',
      group: 'footer',
    }),
  ],
  preview: {
    select: {
      title: 'Nav',
    },
    prepare: ({ title }) => ({
      title: title || 'Nav',
    }),
  },
});
