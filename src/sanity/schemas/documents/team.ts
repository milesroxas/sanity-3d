import { orderRankField } from '@sanity/orderable-document-list';
import { UsersRound } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'team',
  type: 'document',
  title: 'Team',
  icon: UsersRound,
  groups: [
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'settings',
      title: 'Settings',
    },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'content' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'settings',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      group: 'content',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description:
            'Important for accessibility and SEO. Describe the image for screen readers and search engines.',
        },
      ],
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'block-content',
      group: 'content',
    }),

    defineField({
      name: 'blocks',
      type: 'array',
      group: 'content',
      of: [
        { type: 'heroOne' },
        { type: 'hero-2' },
        { type: 'section-header' },
        { type: 'split-row' },
        { type: 'grid-row' },
        { type: 'large-callout' },
        { type: 'featured-content-offset' },
        { type: 'carousel-1' },
        { type: 'carousel-2' },
        { type: 'timeline-row' },
        { type: 'cta-1' },
        { type: 'logo-cloud-1' },
        { type: 'faqs' },
        { type: 'form-newsletter' },
        { type: 'cta-team' },
        { type: 'form-security-request' },
      ],
    }),
    defineField({
      name: 'meta_title',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'meta_description',
      title: 'Meta Description',
      type: 'text',
      group: 'seo',
    }),
    defineField({
      name: 'noindex',
      title: 'No Index',
      type: 'boolean',
      initialValue: false,
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image - [1200x630]',
      type: 'image',
      group: 'seo',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Description of the Open Graph image for accessibility and SEO.',
        },
      ],
    }),
    orderRankField({ type: 'team' }),
  ],
});
