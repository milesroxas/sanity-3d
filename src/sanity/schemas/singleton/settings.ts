import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  groups: [
    {
      name: 'logo',
      title: 'Logo',
    },
    {
      name: 'contact',
      title: 'Contact',
    },
    {
      name: 'address',
      title: 'Address',
    },
    {
      name: 'businessHours',
      title: 'Business Hours',
    },
    {
      name: 'social',
      title: 'Social',
    },
  ],
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'logo',
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
      name: 'largeLogo',
      title: 'Large Logo',
      type: 'image',
      group: 'logo',
      description: 'Displayed on the site landing page.',
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
      name: 'contact',
      title: 'Contact',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({
          name: 'phone',
          title: 'Phone',
          type: 'string',
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      group: 'address',
      fields: [
        defineField({
          name: 'street',
          title: 'Street',
          type: 'string',
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
        }),
        defineField({
          name: 'state',
          title: 'State',
          type: 'string',
        }),
        defineField({
          name: 'zip',
          title: 'Zip',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'businessHours',
      title: 'Business Hours',
      type: 'object',
      group: 'businessHours',
      fields: [
        defineField({
          name: 'hours',
          title: 'Hours',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social',
      type: 'object',
      group: 'social',
      fields: [
        defineField({
          name: 'facebook',
          title: 'Facebook',
          type: 'string',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'string',
        }),
        defineField({
          name: 'yelp',
          title: 'Yelp',
          type: 'string',
        }),
        defineField({
          name: 'googleReviews',
          title: 'Google Reviews',
          type: 'string',
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter',
          type: 'string',
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'string',
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube',
          type: 'string',
        }),
        defineField({
          name: 'tiktok',
          title: 'TikTok',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'Settings',
    },
    prepare: ({ title }) => ({
      title: title || 'Settings',
    }),
  },
});
