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
      name: 'experienceVideo',
      title: 'Default Experience Video',
      type: 'reference',
      to: [{ type: 'media' }],
      description:
        'Optional: Choose a Media Library video used for the experience card on non-experience pages.',
    }),
    defineField({
      name: 'experienceMediaVideo',
      title: 'Experience Page Media',
      type: 'reference',
      to: [{ type: 'media' }],
      description:
        'Optional: Choose a Media Library video used exclusively when the menu opens on the Experience route.',
    }),
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
